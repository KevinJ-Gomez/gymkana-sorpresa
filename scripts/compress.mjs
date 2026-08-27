import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import heicConvert from 'heic-convert';

const sections = [
  '1_inicios',
  '2_postureo',
  '3_viajes',
  '4_intimas',
  '5_duros',
  '6_felicidad'
];

const baseInputDir = './fotos_originales';
const baseOutputDir = './public/gallery';

console.log("🚀 Iniciando optimización de galería (Soporte HEIC activado)...\n");

async function procesarFotos() {
  for (const section of sections) {
    const inputDir = path.join(baseInputDir, section);
    const outputDir = path.join(baseOutputDir, section);

    if (fs.existsSync(inputDir)) {
      // Asegurar que exista la carpeta de destino
      if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
      }

      const files = fs.readdirSync(inputDir).sort();
      let counter = 1;

      for (const file of files) {
        if (file.match(/\.(jpg|jpeg|png|webp|heic)$/i)) {
          const newName = `${counter}.jpg`; 
          const filePath = path.join(inputDir, file);
          const outPath = path.join(outputDir, newName);
          
          try {
            let inputBuffer = fs.readFileSync(filePath);

            if (file.toLowerCase().endsWith('.heic')) {
              console.log(`⏳ Convirtiendo Apple HEIC: ${file}...`);
              inputBuffer = await heicConvert({
                buffer: inputBuffer,
                format: 'JPEG',
                quality: 1 
              });
            }
            
            await sharp(inputBuffer)
              .resize(1080, null, { withoutEnlargement: true })
              .jpeg({ quality: 80 })
              .toFile(outPath);
              
            console.log(`✅ [${section}] ${file} -> ${newName}`);
          } catch (err) {
            console.error(`❌ Error procesando ${file}:`, err);
          }
            
          counter++;
        }
      }
    }
  }
  console.log("\n✨ ¡Todas las fotos procesadas y listas para la web!");
}

procesarFotos();
