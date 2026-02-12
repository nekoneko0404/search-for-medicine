import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function exec(command, cwd) {
    console.log(`\x1b[36m> ${command}\x1b[0m`); // Cyan color
    execSync(command, {
        cwd: cwd || process.cwd(),
        stdio: 'inherit'
    });
}

function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

try {
    console.log('\x1b[36mStarting Unified Build (Node.js ESM)...\x1b[0m');

    // 1. Build Root (Vite)
    console.log('\n\x1b[36m[1/3] Building Root (Vite)...\x1b[0m');
    exec('npm run build:vite');

    // 2. Build Sub-apps (Next.js) using workspaces
    console.log('\n\x1b[36m[2/3] Building Sub-apps (Next.js) via Workspaces...\x1b[0m');
    exec('npm run build --workspaces --if-present');

    // 3. Copy Artifacts
    console.log('\n\x1b[36m[3/3] Copying Artifacts...\x1b[0m');

    const drugNavDir = path.join(__dirname, 'drug-navigator');
    const okuriDir = path.join(__dirname, 'okuri_pakkun', 'okusuri-pakkun-app');

    // Create dist/drug-navigator and dist/okuri_pakkun
    const distDrugNav = path.join(__dirname, 'dist', 'drug-navigator');
    const distOkuri = path.join(__dirname, 'dist', 'okuri_pakkun');

    // Copy content
    copyDir(path.join(drugNavDir, 'out'), distDrugNav);
    copyDir(path.join(okuriDir, 'out'), distOkuri);

    console.log('\n\x1b[32mUnified Build Complete! Output is in "dist/"\x1b[0m');

} catch (error) {
    console.error('\n\x1b[31mBuild Failed!\x1b[0m');
    console.error(error);
    process.exit(1);
}
