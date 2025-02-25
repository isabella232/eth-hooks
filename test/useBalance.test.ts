import { expect } from 'chai';

import { hookTestWrapper } from '~~/helpers/test-utils';
import { defaultBlockWaitOptions } from '~~/helpers/test-utils/constants/testConstants';
import { expectValidWallets } from '~~/helpers/test-utils/functions';
import { fromEther } from '~~/helpers/test-utils/functions/conversions';
import { useBalance } from '~~/hooks';

describe('useBalance', function () {
  it('When the hook is called; then it returns the initial balance', async () => {
    const harness = await hookTestWrapper((address: string | undefined) => useBalance(address ?? ''));
    const [wallet, secondWallet] = harness.mockProvider.getWallets();
    harness.rerender(wallet.address);

    expectValidWallets(wallet, secondWallet);

    await harness.waitForNextUpdate(defaultBlockWaitOptions);
    const balance = await wallet.getBalance();
    const [result] = harness.result.current;
    expect(result).be.equal(balance);
  });

  it('When wallet balances changes; then the hook returns the new balance', async () => {
    const harness = await hookTestWrapper((address: string | undefined) => useBalance(address));
    const [wallet, secondWallet] = harness.mockProvider.getWallets();
    harness.rerender(wallet.address);

    expectValidWallets(wallet, secondWallet);

    const oldBalance = await wallet.getBalance();
    const valueToSend = fromEther(1);
    // await expect(
    await wallet.sendTransaction({
      to: secondWallet.address,
      value: valueToSend,
    });
    // commented out since the waffle chai matcher doesn't work with london hardform.  Merged PR to waffle, but they didn't release it

    // ).to.changeEtherBalances([wallet], [fromEther(-1)]);

    await harness.waitForValueToChange(() => harness.result.current[0], defaultBlockWaitOptions);
    const newBalance = await wallet.getBalance();
    const [result] = harness.result.current;
    expect(result).to.equal(newBalance);
    expect(result).not.to.equal(oldBalance);
  });
});
