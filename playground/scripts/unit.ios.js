const _ = require('lodash');
const shellUtils = require('shell-utils');
const fs = require('fs');

function runWithXcprettyIfPossible(cmd) {
  if (hasXcpretty()) {
    shellUtils.exec.execSync(`${cmd} | xcpretty && exit \${PIPESTATUS[0]}`);
  } else {
    shellUtils.exec.execSync(`${cmd}`);
  }
}

function testProject() {
  shellUtils.exec.execSync(`echo 'travis_fold:start:xcodeunit'`);
  runWithXcprettyIfPossible(`RCT_NO_LAUNCH_PACKAGER=true
          cd ios && xcodebuild
            build
            -scheme "playground"
            -project playground.xcodeproj
            -sdk iphonesimulator
            -configuration Debug`);
  runWithXcprettyIfPossible(`RCT_NO_LAUNCH_PACKAGER=true
          cd ios && xcodebuild
            test
            -scheme "playground"
            -project playground.xcodeproj
            -destination 'platform=iOS Simulator,name=iPhone 7'`);
  shellUtils.exec.execSync(`echo 'travis_fold:end:xcodeunit'`);
}
function hasXcpretty() {
  try {
    return shellUtils.exec.execSyncRead(`which xcpretty`);
  } catch (e) {
    return false;
  }
}

function run() {
  testProject();
}

run();