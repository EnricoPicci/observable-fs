import { expect, should } from 'chai';
import { checkForMinimalNodeVersion } from './check-node-version';

// test the checkForNodeMinimalVersion function
describe('checkForNodeMinimalVersion function', () => {
    it('checks that the current node version is greater than the minimal version', () => {
        const minimalVersion = 'v10.9.9';
        const isCurrentVersionGreater = checkForMinimalNodeVersion(minimalVersion);
        expect(isCurrentVersionGreater).not.throw;
    });

    it('checks that the current node version is NOT greater than the minimal version', () => {
        const minimalVersion = 'v1000000.0.0';
        should().throw(() => {
            checkForMinimalNodeVersion(minimalVersion);
        });
    });
});
