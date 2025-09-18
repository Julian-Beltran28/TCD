import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  Modal,
  Animated,
  Easing,
} from 'react-native';

const Loading = ({ 
  visible = false, 
  text = "Cargando...", 
  overlay = true,
  size = "large",
  color = "#2f95dc" 
}) => {
  const spinValue = React.useMemo(() => new Animated.Value(0), []);
  
  // Solo log en cambios importantes
  React.useEffect(() => {
    if (visible) {
      console.log('🎨 Loading visible:', text);
    }
  }, [visible, text]);
  
  React.useEffect(() => {
    if (visible) {
      const spinAnimation = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      spinAnimation.start();
      
      return () => spinAnimation.stop();
    }
  }, [visible, spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (!visible) return null;

  const LoadingContent = () => (
    <View style={styles.container}>
      <View style={styles.loadingBox}>
        <ActivityIndicator size={size} color={color} />
        <Text style={styles.loadingText}>{text}</Text>
        
        {/* Indicador de progreso personalizado */}
        <Animated.View
          style={[
            styles.progressRing,
            {
              transform: [{ rotate: spin }],
            },
          ]}
        />
      </View>
    </View>
  );

  if (overlay) {
    return (
      <Modal
        transparent={true}
        animationType="fade"
        visible={visible}
        statusBarTranslucent={true}
      >
        <LoadingContent />
      </Modal>
    );
  }

  return <LoadingContent />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingBox: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 120,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  progressRing: {
    position: 'absolute',
    top: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: 'transparent',
    borderTopColor: '#2f95dc',
  },
});

export default Loading;