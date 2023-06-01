"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const check_node_version_1 = require("./check-node-version");
// test the checkForNodeMinimalVersion function
describe('checkForNodeMinimalVersion function', () => {
    it('checks that the current node version is greater than the minimal version', () => {
        const minimalVersion = 'v10.9.9';
        const isCurrentVersionGreater = (0, check_node_version_1.checkForMinimalNodeVersion)(minimalVersion);
        (0, chai_1.expect)(isCurrentVersionGreater).not.throw;
    });
    it('checks that the current node version is NOT greater than the minimal version', () => {
        const minimalVersion = 'v1000000.0.0';
        (0, chai_1.should)().throw(() => {
            (0, check_node_version_1.checkForMinimalNodeVersion)(minimalVersion);
        });
    });
});
//# sourceMappingURL=check-node-version.spec.js.map