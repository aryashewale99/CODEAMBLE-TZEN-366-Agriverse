import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { Header } from '../components/Header';
import { Badge } from '../components/Badge';
import { Colors, Typography, Spacing } from '../theme/colors';
import { voiceService } from '../services/voiceService';
import { ParsedVoiceCommand } from '../services/voiceIntentParser';
import { voiceIotHandler, VoiceExecutionResult } from '../services/voiceIotHandler';

declare var window: any;

const SAMPLE_COMMANDS = [
  'What is the soil moisture?',
  'Is my soil dry?',
  'Turn on irrigation',
  'Turn off irrigation',
  'Start the water pump',
  'Stop the water pump',
  'What is the temperature?',
  'What is the humidity?',
];

export const VoiceAssistantScreen = ({ navigation }: any) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [userTranscript, setUserTranscript] = useState<string>('');
  const [parsedCommand, setParsedCommand] = useState<ParsedVoiceCommand | null>(null);
  const [executionResult, setExecutionResult] = useState<VoiceExecutionResult | null>(null);
  const [isEsp32Online, setIsEsp32Online] = useState<boolean>(true);
  const [pendingConfirmation, setPendingConfirmation] = useState<string | null>(null);
  
  // Real-time backend status state
  const [openAiActive, setOpenAiActive] = useState<boolean>(false);
  const [engineName, setEngineName] = useState<string>('Checking engine status...');

  const fetchVoiceEngineStatus = useCallback(async () => {
    try {
      const status = await voiceService.getVoiceStatus();
      setOpenAiActive(status.openAiActive);
      setEngineName(status.engineName);
    } catch (e) {
      console.warn('Unable to reach backend voice status endpoint:', e);
      setOpenAiActive(false);
      setEngineName('AgriVerse Backend Agronomic Engine');
    }
  }, []);

  useEffect(() => {
    fetchVoiceEngineStatus();
  }, [fetchVoiceEngineStatus]);

  const handleToggleEsp32 = () => {
    const nextState = !isEsp32Online;
    setIsEsp32Online(nextState);
    voiceIotHandler.setEsp32ConnectedStatus(nextState);
  };

  const processVoiceInputText = async (text: string) => {
    if (!text || !text.trim()) {
      Alert.alert('Speech Input Required', 'Please speak or select a valid voice query.');
      return;
    }

    const cleanText = text.trim();
    setUserTranscript(cleanText);
    setIsProcessing(true);
    setExecutionResult(null);
    setParsedCommand(null);

    try {
      // 1. Query AgriVerse Voice Backend API endpoint securely
      const backendResult = await voiceService.queryVoiceBackend(cleanText);

      // 2. Parse intent and construct command payload
      const parsed: ParsedVoiceCommand = {
        intent: (backendResult.intent as any) || 'GENERAL_AGRI',
        transcript: cleanText,
        confidence: 0.95,
        requiresConfirmation: backendResult.intent === 'TURN_ON_PUMP',
        explanation: backendResult.actionTaken || 'Processed by AgriVerse Voice Engine',
        source: backendResult.source || 'AgriVerse Backend Engine',
      };
      setParsedCommand(parsed);

      const result: VoiceExecutionResult = {
        speechResponse: backendResult.speechResponse,
        actionTaken: backendResult.actionTaken,
        isEsp32Connected: isEsp32Online,
        requiresConfirmation: backendResult.intent === 'TURN_ON_PUMP',
        confirmationType: backendResult.intent === 'TURN_ON_PUMP' ? 'CONFIRM_PUMP_ON' : undefined,
        zoneId: 'z1',
      };
      setExecutionResult(result);

      // Refresh engine status to ensure banner reflects current engine
      await fetchVoiceEngineStatus();

      // 3. Handle confirmation requirement for pump activation vs speech playback
      if (result.requiresConfirmation && result.confirmationType === 'CONFIRM_PUMP_ON') {
        setPendingConfirmation(result.zoneId || 'z1');
      } else {
        // Speak response via Voice Service (Text-to-Speech)
        await voiceService.speakText(backendResult.speechResponse);
      }
    } catch (err: any) {
      console.error('Voice Assistant processing error:', err);
      Alert.alert(
        'Voice Service Error',
        err?.message || 'Failed to process voice query. Please verify backend connection.'
      );
    } finally {
      setIsProcessing(false);
      setIsListening(false);
    }
  };

  const handleSimulateMicrophone = async () => {
    const hasPermission = await voiceService.requestMicrophonePermission();
    if (!hasPermission) {
      Alert.alert('Microphone Permission Denied', 'Microphone access is required to capture voice commands.');
      return;
    }

    setIsListening(true);
    setUserTranscript('');

    // Trigger Speech Recognition if Web Speech API is supported
    if (typeof window !== 'undefined' && (window as any).webkitSpeechRecognition) {
      try {
        const SpeechRecognition = (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event: any) => {
          const speechToText = event.results[0][0].transcript;
          processVoiceInputText(speechToText);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error event:', event.error);
          setIsListening(false);
          Alert.alert('Speech Recognition Notice', `Audio capture event: ${event.error}. Defaulting to voice query.`);
          processVoiceInputText('Which crop is suitable for my soil?');
        };

        recognition.start();
        return;
      } catch (e) {
        console.warn('SpeechRecognition initialization error:', e);
      }
    }

    // Fallback for environments / iOS simulators without active SpeechRecognition API hardware
    setTimeout(() => {
      processVoiceInputText('Which crop is suitable for my soil?');
    }, 1200);
  };

  const handleConfirmPumpStart = async () => {
    if (!pendingConfirmation) return;
    setIsProcessing(true);
    try {
      const result = await voiceIotHandler.confirmTurnOnPump(pendingConfirmation);
      setExecutionResult(result);
      setPendingConfirmation(null);
      await voiceService.speakText(result.speechResponse);
    } catch (err) {
      console.error('Failed to confirm pump start:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ScreenContainer scrollable={false}>
      <Header
        title="Voice AI Assistant"
        subtitle="IoT Control & Natural Language Telemetry"
        showBack={navigation.canGoBack()}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>

        {/* OpenAI Status Banner */}
        <View style={openAiActive ? styles.openAiCardActive : styles.openAiCardInactive}>
          <View style={styles.openAiHeader}>
            <Text style={styles.openAiIcon}>{openAiActive ? '🤖' : '⚠️'}</Text>
            <Text style={styles.openAiTitle}>
              {openAiActive ? 'OpenAI GPT-4o Voice Engine Active' : 'OpenAI API Key Unconfigured'}
            </Text>
          </View>
          <Text style={styles.openAiSub}>
            {openAiActive
              ? `Cloud voice synthesis and natural language processing enabled (${engineName}).`
              : 'Voice AI backend is ready. Set OPENAI_API_KEY in server/.env (locally) or Render Environment Secrets (production) to enable OpenAI GPT-4o. Fallback agronomic engine active.'}
          </Text>
        </View>

        {/* ESP32 Hardware Status Row */}
        <View style={styles.espBar}>
          <View style={styles.espLeft}>
            <Text style={styles.espIcon}>{isEsp32Online ? '⚡' : '🔌'}</Text>
            <Text style={styles.espTitle}>
              ESP32 Controller: {isEsp32Online ? 'Connected' : 'Disconnected'}
            </Text>
          </View>
          <TouchableOpacity style={styles.espToggleBtn} onPress={handleToggleEsp32}>
            <Text style={styles.espToggleText}>
              {isEsp32Online ? 'Simulate Disconnect' : 'Reconnect'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Microphone Pulse Hero */}
        <View style={styles.micHero}>
          <TouchableOpacity
            style={[styles.micBtn, isListening && styles.micBtnListening]}
            activeOpacity={0.8}
            onPress={handleSimulateMicrophone}>
            <Text style={styles.micIcon}>{isListening ? '🎙️' : '🎙️'}</Text>
          </TouchableOpacity>

          <Text style={styles.micStatusText}>
            {isListening
              ? 'Listening to Farmer Voice...'
              : isProcessing
              ? 'Processing Natural Language Intent...'
              : 'Tap Microphone or Select Command Below'}
          </Text>
        </View>

        {/* Sample Voice Commands Selector */}
        <Text style={styles.sectionTitle}>Sample Voice Commands</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.sampleScroll}>
          {SAMPLE_COMMANDS.map((cmd, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.sampleChip}
              activeOpacity={0.8}
              onPress={() => processVoiceInputText(cmd)}>
              <Text style={styles.sampleChipText}>💬 "{cmd}"</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Processing Indicator */}
        {isProcessing && (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Processing Natural Language Intent...</Text>
          </View>
        )}

        {/* Results Output */}
        {userTranscript !== '' && !isProcessing && (
          <View style={styles.resultSection}>

            {/* Transcript Card */}
            <View style={styles.transcriptCard}>
              <Text style={styles.cardLabel}>Farmer Speech Transcript</Text>
              <Text style={styles.userText}>"{userTranscript}"</Text>
              {parsedCommand && (
                <View style={styles.intentMetaRow}>
                  <Badge
                    label={`INTENT: ${parsedCommand.intent}`}
                    variant={parsedCommand.intent === 'UNKNOWN' ? 'warning' : 'primary'}
                  />
                  <Text style={styles.sourceTag}>Engine: {parsedCommand.source}</Text>
                </View>
              )}
            </View>

            {/* Response Card */}
            {executionResult && (
              <View style={styles.responseCard}>
                <View style={styles.responseHeader}>
                  <Text style={styles.cardLabel}>AI Assistant Response</Text>
                  <Text style={styles.speakerIcon}>🔊</Text>
                </View>

                <Text style={styles.responseText}>{executionResult.speechResponse}</Text>

                <View style={styles.actionTagRow}>
                  <Badge
                    label={executionResult.actionTaken}
                    variant={executionResult.isEsp32Connected ? 'success' : 'danger'}
                  />
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Pump Activation Confirmation Modal */}
      <Modal
        visible={!!pendingConfirmation}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setPendingConfirmation(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalIcon}>⚠️</Text>
            <Text style={styles.modalTitle}>Pump Activation Confirmation</Text>
            <Text style={styles.modalBody}>
              Voice Assistant received command to start the Water Pump for Irrigation Zone 1. Please confirm to engage ESP32 relay.
            </Text>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleConfirmPumpStart}>

                <Text style={styles.modalConfirmText}>Confirm Pump Start</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setPendingConfirmation(null)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  openAiCardActive: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  openAiCardInactive: {
    backgroundColor: Colors.warningLight,
    borderRadius: 14,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },
  openAiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  openAiIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  openAiTitle: {
    fontSize: Typography.bodySize,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
  },
  openAiSub: {
    fontSize: Typography.captionSize,
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  espBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  espLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  espIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  espTitle: {
    fontSize: Typography.captionSize + 1,
    fontWeight: Typography.weightSemiBold,
    color: Colors.textPrimary,
  },
  espToggleBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: 6,
  },
  espToggleText: {
    fontSize: Typography.captionSize,
    color: Colors.textSecondary,
  },
  micHero: {
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  micBtn: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  micBtnListening: {
    backgroundColor: Colors.danger,
  },
  micIcon: {
    fontSize: 40,
  },
  micStatusText: {
    fontSize: Typography.bodySize,
    fontWeight: Typography.weightSemiBold,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: Typography.titleSize - 2,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  sampleScroll: {
    marginBottom: Spacing.md,
  },
  sampleChip: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.primaryLight + '30',
  },
  sampleChipText: {
    fontSize: Typography.captionSize + 1,
    color: Colors.primaryDark,
    fontWeight: Typography.weightMedium,
  },
  loadingBox: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: Typography.bodySize,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  resultSection: {
    marginTop: Spacing.xs,
  },
  transcriptCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardLabel: {
    fontSize: Typography.captionSize,
    color: Colors.textMuted,
    fontWeight: Typography.weightBold,
  },
  userText: {
    fontSize: Typography.bodySize + 1,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
    marginVertical: 4,
  },
  intentMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  sourceTag: {
    fontSize: Typography.captionSize,
    color: Colors.textMuted,
  },
  responseCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  responseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  speakerIcon: {
    fontSize: 18,
  },
  responseText: {
    fontSize: Typography.bodySize + 1,
    color: Colors.textPrimary,
    lineHeight: 20,
    marginVertical: Spacing.xs,
  },
  actionTagRow: {
    marginTop: Spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  modalContent: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  modalIcon: {
    fontSize: 42,
    marginBottom: Spacing.xs,
  },
  modalTitle: {
    fontSize: Typography.titleSize - 2,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  modalBody: {
    fontSize: Typography.bodySize,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  modalBtnRow: {
    width: '100%',
  },
  modalConfirmBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  modalConfirmText: {
    color: Colors.textLight,
    fontSize: Typography.bodySize,
    fontWeight: Typography.weightBold,
  },
  modalCancelBtn: {
    backgroundColor: Colors.borderLight,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    color: Colors.textPrimary,
    fontSize: Typography.bodySize,
    fontWeight: Typography.weightMedium,
  },
});

export default VoiceAssistantScreen;
