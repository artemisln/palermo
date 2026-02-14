const fs = require('fs');
const path = require('path');

const podfilePath = path.join(process.cwd(), 'ios', 'Podfile');
if (!fs.existsSync(podfilePath)) {
  process.exit(0);
}

const warningPatchMarker = "build_config.build_settings['GCC_WARN_INHIBIT_ALL_WARNINGS']";
let podfile = fs.readFileSync(podfilePath, 'utf8');
let changed = false;

if (!podfile.includes('inhibit_all_warnings!')) {
  podfile = podfile.replace(
    /(platform :ios[^\n]*\n)/,
    "$1inhibit_all_warnings!\n"
  );
  changed = true;
}

if (!podfile.includes(warningPatchMarker)) {
  const postInstallNeedle = "    )\n  end\nend\n";
  const warningPatch = `    )\n\n    # Suppress warning noise from third-party pods compiled as part of app builds.\n    installer.pods_project.targets.each do |target|\n      target.build_configurations.each do |build_config|\n        build_config.build_settings['GCC_WARN_INHIBIT_ALL_WARNINGS'] = 'YES'\n        build_config.build_settings['SWIFT_SUPPRESS_WARNINGS'] = 'YES'\n      end\n    end\n  end\nend\n`;
  if (podfile.includes(postInstallNeedle)) {
    podfile = podfile.replace(postInstallNeedle, warningPatch);
    changed = true;
  }
}

if (changed) {
  fs.writeFileSync(podfilePath, podfile);
}
