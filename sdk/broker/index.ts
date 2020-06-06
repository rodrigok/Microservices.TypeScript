import { LocalBroker } from './LocalBroker';
import { RemoteBroker } from './RemoteBroker';

const useLocal = false;

export const broker = useLocal ? new LocalBroker() : new RemoteBroker();
