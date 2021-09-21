import { useCallback, useState } from 'react';

import { TEthersProvider } from '~~/models';
import { useOnRepetition } from '~~/useOnRepetition';

/**
 * Get the current block number of the network
 * @param provider (TEthersProvider)
 * @param pollTime (number) :: if >0 use polling, else use instead of onBlock event
 * @returns (number) :: block number
 */
export const useBlockNumber = (provider: TEthersProvider, pollTime: number = 0): number => {
  const [blockNumber, setBlockNumber] = useState<number>(0);

  const getBlockNumber = useCallback(async (): Promise<void> => {
    const nextBlockNumber = await provider.getBlockNumber();
    if (nextBlockNumber !== blockNumber) {
      setBlockNumber(nextBlockNumber);
    }
  }, [blockNumber, provider]);

  useOnRepetition(getBlockNumber, { provider, pollTime });

  return blockNumber;
};
