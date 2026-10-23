import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

export const useHaptics = () => {
  const triggerImpact = async (style = ImpactStyle.Light) => {
    try {
      await Haptics.impact({ style });
    } catch {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(style === ImpactStyle.Heavy ? 40 : 15);
      }
    }
  };

  const triggerSuccess = async () => {
    try {
      await Haptics.notification({ type: NotificationType.Success });
    } catch {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([20, 50, 20]);
      }
    }
  };

  return { triggerImpact, triggerSuccess };
};
