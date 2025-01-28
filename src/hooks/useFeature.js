import { useSubscription } from '../contexts/SubscriptionContext';

export function useFeature(featureName) {
  const { checkPermission } = useSubscription();
  return checkPermission(featureName);
}