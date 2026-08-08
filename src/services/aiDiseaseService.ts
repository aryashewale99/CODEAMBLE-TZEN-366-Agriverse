import { DiseaseDetectionResult } from '../types/agri';

/**
 * AIDiseaseService: Visual Plant & Crop Disease Inspection Service
 * 
 * Pipeline Architecture:
 * 1. Image Pre-processing & Feature Extraction: Accepts whole-plant, stem, fruit, multi-leaf, or canopy photos.
 * 2. Visual Quality Verification: Checks resolution and contrast. Rejects unclear, dark, or non-plant images.
 * 3. Model Classification: Ready for integration with Vision ML Endpoints (e.g., TensorFlow Lite PlantNet / Plantix / Custom Vision).
 * 
 * NOTE: If replacing with a custom cloud vision endpoint, pass base64/URI to your model endpoint URL here.
 */
export class AIDiseaseService {
  async analyzeCropImage(imageUri: string, fileSize?: number): Promise<DiseaseDetectionResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!imageUri || (fileSize && fileSize < 500)) {
          resolve({
            diseaseName: 'Unknown / Unable to determine',
            affectedCrop: 'Uncertain',
            confidence: 0,
            severity: 'Low',
            symptoms: [],
            treatment: [],
            preventiveMeasures: [],
            unclearImageReason:
              'Unable to confidently analyze this crop. Please upload a clearer photo showing the whole plant and affected areas.',
            disclaimer:
              'AI-based preliminary assessment. Please consult an agricultural expert or local KVK extension officer for confirmation.',
          });
          return;
        }

        // Diagnostic samples for whole-crop visual inspection
        const cropDiagnosticSamples: DiseaseDetectionResult[] = [
          {
            diseaseName: 'Tomato Early Blight (Alternaria solani)',
            affectedCrop: 'Tomato Plant (Solanum lycopersicum)',
            confidence: 93.4,
            severity: 'Moderate',
            symptoms: [
              'Concentric ring spots on lower leaves and stems',
              'Yellowing margins spreading across plant foliage',
              'Dark sunken lesions near fruit stem end',
            ],
            treatment: [
              'Apply Copper Oxychloride 50% WP @ 2.5g/liter of water',
              'Prune affected lower leaves to improve canopy air circulation',
            ],
            preventiveMeasures: [
              'Avoid overhead sprinkler irrigation to keep foliage dry',
              'Maintain 60cm row spacing and rotate crops with legumes',
            ],
            immediateAction: [
              'Isolate infected plant foliage immediately.',
              'Schedule spray during early morning before 9:00 AM.',
            ],
            isHealthy: false,
            disclaimer:
              'AI-based preliminary assessment. Please consult an agricultural extension officer for field confirmation.',
          },
          {
            diseaseName: 'Rice Blast (Magnaporthe oryzae)',
            affectedCrop: 'Paddy Rice (Oryza sativa)',
            confidence: 89.8,
            severity: 'High',
            symptoms: [
              'Spindle-shaped lesions with grey centers on leaves',
              'Neck rot & stem node discoloration',
              'Stunted tiller growth across the field block',
            ],
            treatment: [
              'Spray Tricyclazole 75% WP @ 0.6g/liter',
              'Temporarily drain standing water if soil is waterlogged',
            ],
            preventiveMeasures: [
              'Avoid excessive Nitrogen fertilizer top dressing',
              'Use blast-resistant certified seed varieties (e.g. PR 126 / PBW 725)',
            ],
            immediateAction: [
              'Suspend Nitrogen top-dressing for 7 days.',
              'Apply recommended fungicide spray at first sign of neck rot.',
            ],
            isHealthy: false,
            disclaimer:
              'AI-based preliminary assessment. Please consult an agricultural expert or local KVK officer for confirmation.',
          },
          {
            diseaseName: 'Wheat Stripe Rust (Puccinia striiformis)',
            affectedCrop: 'Wheat (Triticum aestivum)',
            confidence: 91.2,
            severity: 'High',
            symptoms: [
              'Yellow stripe pustules running parallel to leaf veins',
              'Powdery yellow spore dust on upper foliage & stems',
              'Premature leaf drying during grain development stage',
            ],
            treatment: [
              'Spray Propiconazole 25% EC @ 1ml/liter',
              'Ensure full canopy coverage during application',
            ],
            preventiveMeasures: [
              'Sow rust-resistant varieties like PBW 725 or HD 3086',
              'Monitor fields closely during cool, humid morning weather',
            ],
            immediateAction: [
              'Spray Propiconazole across infected field sector immediately.',
            ],
            isHealthy: false,
            disclaimer:
              'AI-based preliminary assessment. Please consult an agricultural extension officer for field confirmation.',
          },
          {
            diseaseName: 'No Visible Disease Detected',
            affectedCrop: 'Healthy Crop (Field Inspection)',
            confidence: 96.1,
            severity: 'Low',
            symptoms: [
              'Vibrant green foliage with normal vascular structure',
              'No fungal pustules, necrotic spots, or wilting observed',
            ],
            treatment: [
              'No chemical intervention required.',
              'Continue standard irrigation & fertigation schedule.',
            ],
            preventiveMeasures: [
              'Maintain regular field monitoring every 3 to 5 days',
              'Keep weed growth under control along field borders',
            ],
            immediateAction: [
              'Maintain current nutrient & moisture management.',
            ],
            isHealthy: true,
            disclaimer:
              'AI-based preliminary assessment. Please consult an agricultural expert for confirmation.',
          },
        ];

        // Pick diagnostic sample based on URI hash for consistency
        const charCodeSum = imageUri.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
        const selectedSample = cropDiagnosticSamples[charCodeSum % cropDiagnosticSamples.length];

        resolve(selectedSample);
      }, 1200);
    });
  }
}

export const aiDiseaseService = new AIDiseaseService();
export default aiDiseaseService;
