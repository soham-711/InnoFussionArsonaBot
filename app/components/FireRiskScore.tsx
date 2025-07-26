import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Svg, Circle } from 'react-native-svg';

interface FireRiskScoreProps {
  score: number;
}

const FireRiskScore = ({ score }: FireRiskScoreProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const animatedValue = new Animated.Value(0);
  const [dashOffset, setDashOffset] = useState(0);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: score,
      duration: 1000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();

    const listener = animatedValue.addListener(({ value }) => {
      const circumference = 2 * Math.PI * 60;
      const offset = circumference - (circumference * value / 100);
      setDashOffset(offset);
    });

    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 500);

    return () => {
      animatedValue.removeListener(listener);
      clearTimeout(timer);
    };
  }, [score]);

  const getScoreColor = (score: number) => {
    if (score < 30) return '#00FF00';
    if (score < 70) return '#FFFF00';
    return '#FF0000';
  };

  const getScoreStatus = (score: number) => {
    if (score < 30) return 'LOW RISK';
    if (score < 70) return 'MODERATE';
    return 'HIGH RISK';
  };

  const circumference = 2 * Math.PI * 60;
  const strokeDasharray = circumference.toString();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FIRE RISK ASSESSMENT</Text>
      
      <View style={styles.circleContainer}>
        <Svg width="144" height="144" viewBox="0 0 144 144" style={styles.svg}>
          <Circle
            cx="72"
            cy="72"
            r="60"
            stroke="#1A1A1A"
            strokeWidth="8"
            fill="none"
            strokeOpacity="0.3"
          />
          <Circle
            cx="72"
            cy="72"
            r="60"
            stroke={getScoreColor(score)}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={dashOffset}
          />
        </Svg>
        
        <View style={styles.scoreContainer}>
          <Animated.Text style={[
            styles.scoreText, 
            { color: getScoreColor(score) }
          ]}>
            {Math.round(animatedScore)}
          </Animated.Text>
          <Text style={styles.scoreLabel}>RISK SCORE</Text>
        </View>
      </View>
      
      <Text style={[
        styles.statusText,
        { color: getScoreColor(score) }
      ]}>
        STATUS: {getScoreStatus(score)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 165, 0, 0.3)',
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF4500',
    marginBottom: 16,
    fontFamily: 'monospace',
    textShadowColor: '#FF4500',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  circleContainer: {
    position: 'relative',
    width: 144,
    height: 144,
    marginBottom: 16,
  },
  svg: {
    transform: [{ rotate: '-90deg' }],
  },
  scoreContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#AAAAAA',
    fontFamily: 'monospace',
    marginTop: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'monospace',
    marginTop: 8,
  },
});

export default FireRiskScore;