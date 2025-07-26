import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface Agent {
  type: 'CO₂' | 'Water Mist' | 'Chemical Mist';
  level: number;
  color: string;
  refillDate?: string;
}

const AgentLevels = () => {
  const [agents, setAgents] = useState<Agent[]>([
    { type: 'CO₂', level: 78, color: '#00a8ff', refillDate: '2 days' },
    { type: 'Water Mist', level: 91, color: '#00ff9d', refillDate: '5 days' },
    { type: 'Chemical Mist', level: 34, color: '#ffcc00', refillDate: 'Tomorrow' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => ({
        ...agent,
        level: Math.max(0, agent.level - Math.random() * 2)
      })));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getLevelColor = (level: number, baseColor: string) => {
    if (level < 25) return '#ff4757';
    if (level < 50) return '#ffcc00';
    return baseColor;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SUPPRESSION AGENTS</Text>
      
      <View style={styles.agentsContainer}>
        {agents.map((agent) => {
          const levelColor = getLevelColor(agent.level, agent.color);
          
          return (
            <View key={agent.type} style={styles.agentCard}>
              <View style={styles.agentHeader}>
                <Text style={styles.agentType}>{agent.type}</Text>
                <Text style={[styles.agentLevel, { color: levelColor }]}>
                  {Math.round(agent.level)}%
                </Text>
              </View>
              
              {/* Tank visualization */}
              <View style={styles.tankContainer}>
                <View style={styles.tankBackground}>
                  <Animated.View 
                    style={[
                      styles.tankFill, 
                      { 
                        width: `${agent.level}%`,
                        backgroundColor: levelColor,
                      }
                    ]}
                  />
                  <View style={styles.tankTextContainer}>
                    <Text style={styles.tankText}>{agent.type}</Text>
                  </View>
                </View>
              </View>
              
              {agent.level < 50 && (
                <View style={styles.refillWarning}>
                  <Text style={styles.refillText}>⚠️ Refill needed: {agent.refillDate}</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 165, 0, 0.2)',
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFA500',
    fontFamily: 'monospace',
    marginBottom: 16,
    textAlign: 'center',
  },
  agentsContainer: {
    gap: 12,
  },
  agentCard: {
    backgroundColor: 'rgba(30, 30, 36, 0.7)',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 165, 0, 0.1)',
  },
  agentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  agentType: {
    color: '#AAAAAA',
    fontFamily: 'monospace',
    fontWeight: '500',
  },
  agentLevel: {
    fontFamily: 'monospace',
    fontWeight: 'bold',
    fontSize: 14,
  },
  tankContainer: {
    height: 32,
    justifyContent: 'center',
  },
  tankBackground: {
    height: 24,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 165, 0, 0.2)',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  tankFill: {
    position: 'absolute',
    height: '100%',
    borderRadius: 12,
  },
  tankTextContainer: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
  },
  tankText: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  refillWarning: {
    marginTop: 8,
  },
  refillText: {
    color: '#FFCC00',
    fontSize: 12,
    fontFamily: 'monospace',
  },
});

export default AgentLevels;