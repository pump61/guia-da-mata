import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from './utils/theme';

const { width, height } = Dimensions.get('window');

function Leaf({ color, style }) {
  return (
    <Svg width={48} height={64} viewBox="0 0 48 64" style={style}>
      <Path
        d="M24 2 C24 2, 44 18, 40 38 C37 52, 26 60, 24 62 C22 60, 11 52, 8 38 C4 18, 24 2, 24 2Z"
        fill={color}
        opacity={0.9}
      />
      <Path
        d="M24 8 C24 8, 24 30, 24 62"
        stroke={color}
        strokeWidth={1.2}
        opacity={0.35}
        fill="none"
        strokeDasharray="2,3"
      />
      <Path d="M24 20 C20 22, 14 28, 10 35" stroke={color} strokeWidth={0.8} opacity={0.25} fill="none" />
      <Path d="M24 20 C28 22, 34 28, 38 35" stroke={color} strokeWidth={0.8} opacity={0.25} fill="none" />
      <Path d="M24 34 C20 36, 15 40, 12 46" stroke={color} strokeWidth={0.8} opacity={0.25} fill="none" />
      <Path d="M24 34 C28 36, 33 40, 36 46" stroke={color} strokeWidth={0.8} opacity={0.25} fill="none" />
    </Svg>
  );
}

export default function SplashScreen({ onFinish }) {
  const { theme } = useTheme();

  // Cada folha tem translateX, translateY, opacity e rotate
  const leafAnims = Array.from({ length: 12 }, () => ({
    x:       useRef(new Animated.Value(0)).current,
    y:       useRef(new Animated.Value(0)).current,
    opacity: useRef(new Animated.Value(0)).current,
    rotate:  useRef(new Animated.Value(0)).current,
    scale:   useRef(new Animated.Value(0.6)).current,
  }));

  const logoOpacity    = useRef(new Animated.Value(0)).current;
  const logoScale      = useRef(new Animated.Value(0.8)).current;
  const titleOpacity   = useRef(new Animated.Value(0)).current;
  const titleTranslate = useRef(new Animated.Value(14)).current;
  const dot1           = useRef(new Animated.Value(0.3)).current;
  const dot2           = useRef(new Animated.Value(0.3)).current;
  const dot3           = useRef(new Animated.Value(0.3)).current;
  const screenOpacity  = useRef(new Animated.Value(1)).current;

  // Configuração de cada folha:
  // startX/Y = posição inicial fora da tela
  // endX/Y   = posição final espalhada pela tela
  // rotation = rotação final
  // size     = escala
  const leafConfigs = [
    // canto superior esquerdo → entra pela esquerda/topo
    { startX: -120, startY: -100, endX: 18,        endY: 60,         rot: '210deg', size: 1.1 },
    // topo centro esquerda → entra pelo topo
    { startX: -80,  startY: -140, endX: width*0.18, endY: 120,        rot: '190deg', size: 0.85 },
    // topo centro → entra pelo topo
    { startX: 20,   startY: -160, endX: width*0.38, endY: 40,         rot: '175deg', size: 1.0 },
    // topo centro direita → entra pelo topo
    { startX: 100,  startY: -140, endX: width*0.58, endY: 100,        rot: '155deg', size: 0.9 },
    // canto superior direito → entra pela direita/topo
    { startX: 160,  startY: -100, endX: width*0.76, endY: 55,         rot: '140deg', size: 1.05 },
    // lateral direita topo → entra pela direita
    { startX: 200,  startY: 0,    endX: width*0.82, endY: height*0.3, rot: '90deg',  size: 0.8 },
    // lateral direita baixo → entra pela direita
    { startX: 200,  startY: 80,   endX: width*0.78, endY: height*0.6, rot: '30deg',  size: 0.95 },
    // canto inferior direito → entra pela direita/baixo
    { startX: 160,  startY: 160,  endX: width*0.72, endY: height*0.78, rot: '10deg', size: 1.0 },
    // baixo centro direita → entra pelo baixo
    { startX: 60,   startY: 180,  endX: width*0.52, endY: height*0.84, rot: '-5deg', size: 0.88 },
    // baixo centro esquerda → entra pelo baixo
    { startX: -40,  startY: 180,  endX: width*0.28, endY: height*0.80, rot: '-20deg', size: 0.92 },
    // canto inferior esquerdo → entra pela esquerda/baixo
    { startX: -160, startY: 160,  endX: 22,          endY: height*0.72, rot: '-40deg', size: 1.0 },
    // lateral esquerda centro → entra pela esquerda
    { startX: -180, startY: 20,   endX: 10,          endY: height*0.42, rot: '-90deg', size: 0.87 },
  ];

  useEffect(() => {
    // Inicializa posições de início
    leafConfigs.forEach((cfg, i) => {
      leafAnims[i].x.setValue(cfg.startX);
      leafAnims[i].y.setValue(cfg.startY);
    });

    // Anima cada folha entrando com delay escalonado
    const leafIn = leafConfigs.map((cfg, i) =>
      Animated.parallel([
        Animated.timing(leafAnims[i].x, {
          toValue: 0,
          duration: 900,
          delay: i * 100,
          useNativeDriver: true,
        }),
        Animated.timing(leafAnims[i].y, {
          toValue: 0,
          duration: 900,
          delay: i * 100,
          useNativeDriver: true,
        }),
        Animated.timing(leafAnims[i].opacity, {
          toValue: 1,
          duration: 600,
          delay: i * 100,
          useNativeDriver: true,
        }),
        Animated.spring(leafAnims[i].scale, {
          toValue: cfg.size,
          tension: 50,
          friction: 9,
          delay: i * 100,
          useNativeDriver: true,
        }),
        Animated.timing(leafAnims[i].rotate, {
          toValue: 1,
          duration: 900,
          delay: i * 100,
          useNativeDriver: true,
        }),
      ])
    );

    // Logo e título
    const contentIn = Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        delay: 700,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 45,
        friction: 8,
        delay: 700,
        useNativeDriver: true,
      }),
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 600,
        delay: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(titleTranslate, {
        toValue: 0,
        duration: 600,
        delay: 1000,
        useNativeDriver: true,
      }),
    ]);

    // Pontos pulsando
    const pulseDot = (dot, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1,   duration: 350, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0.3, duration: 350, useNativeDriver: true }),
        ])
      );

    const dotsLoop = Animated.parallel([
      pulseDot(dot1, 0),
      pulseDot(dot2, 230),
      pulseDot(dot3, 460),
    ]);

    // Saída após 5 segundos
    const exitAnim = Animated.timing(screenOpacity, {
      toValue: 0,
      duration: 600,
      delay: 4400,
      useNativeDriver: true,
    });

    // Roda tudo
    Animated.parallel([...leafIn, contentIn]).start(() => {
      dotsLoop.start();
    });

    exitAnim.start(() => {
      dotsLoop.stop();
      onFinish?.();
    });
  }, []);

  const leafColor = theme.accent + 'BB';

  return (
    <Animated.View style={[styles.container, { backgroundColor: theme.background, opacity: screenOpacity }]}>

      {/* Folhas espalhadas pela tela, entrando de fora */}
      {leafConfigs.map((cfg, i) => {
        const rotate = leafAnims[i].rotate.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', cfg.rot],
        });
        return (
          <Animated.View
            key={i}
            style={[
              styles.leafWrap,
              {
                left: cfg.endX,
                top:  cfg.endY,
                opacity: leafAnims[i].opacity,
                transform: [
                  { translateX: leafAnims[i].x },
                  { translateY: leafAnims[i].y },
                  { scale: leafAnims[i].scale },
                  { rotate },
                ],
              },
            ]}
          >
            <Leaf color={leafColor} />
          </Animated.View>
        );
      })}

      {/* Centro */}
      <View style={styles.center} pointerEvents="none">
        <Animated.View style={{ opacity: logoOpacity, transform: [{ scale: logoScale }] }}>
          <Svg width={88} height={108} viewBox="0 0 48 64">
            <Path
              d="M24 2 C24 2, 44 18, 40 38 C37 52, 26 60, 24 62 C22 60, 11 52, 8 38 C4 18, 24 2, 24 2Z"
              fill={theme.accent}
            />
            <Path
              d="M24 8 C24 8, 24 30, 24 62"
              stroke={theme.accentText}
              strokeWidth={1.5}
              opacity={0.45}
              fill="none"
              strokeDasharray="2,4"
            />
            <Path d="M24 20 C20 22, 14 28, 10 35" stroke={theme.accentText} strokeWidth={1} opacity={0.35} fill="none" />
            <Path d="M24 20 C28 22, 34 28, 38 35" stroke={theme.accentText} strokeWidth={1} opacity={0.35} fill="none" />
            <Path d="M24 34 C20 36, 15 40, 12 46" stroke={theme.accentText} strokeWidth={1} opacity={0.35} fill="none" />
            <Path d="M24 34 C28 36, 33 40, 36 46" stroke={theme.accentText} strokeWidth={1} opacity={0.35} fill="none" />
          </Svg>
        </Animated.View>

        <Animated.View style={{ opacity: titleOpacity, transform: [{ translateY: titleTranslate }], alignItems: 'center', marginTop: 20 }}>
          <Text style={[styles.appName, { color: theme.textPrimary }]}>Guia da Mata</Text>
          <Text style={[styles.tagline, { color: theme.textMuted }]}>Identificação florestal</Text>
        </Animated.View>

        <Animated.View style={styles.dotsRow}>
          {[dot1, dot2, dot3].map((dot, i) => (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: theme.accent,
                  opacity: dot,
                  transform: [{
                    scale: dot.interpolate({ inputRange: [0.3, 1], outputRange: [0.7, 1.3] }),
                  }],
                },
              ]}
            />
          ))}
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  leafWrap: {
    position: 'absolute',
  },
  center: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 38,
    fontWeight: '700',
    letterSpacing: 2,
  },
    tagline: {
    fontSize: 14,
    fontWeight: '300',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginTop: 8,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginTop: 38,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
});