interface HotComponentObserverEvent {
  classNames: string[];
  mod: any;
}

type HotComponentObserver = (event: HotComponentObserverEvent) => void;

interface Window {
  hotComponentObservers: Set<HotComponentObserver>;
}
