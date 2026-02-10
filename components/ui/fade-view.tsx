import { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { ViewStyle, StyleProp } from 'react-native';

interface FadeViewProps {
  visible: boolean;
  duration?: number;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  testID?: string;
}

export function FadeView({ visible, duration = 500, style, children, testID }: FadeViewProps) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, {
      duration,
      easing: Easing.inOut(Easing.ease),
    });
  }, [visible, duration, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[style, animatedStyle]} testID={testID}>
      {children}
    </Animated.View>
  );
}
