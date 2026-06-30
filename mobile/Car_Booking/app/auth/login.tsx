import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  SafeAreaView, Platform, StatusBar, Alert,
  Dimensions, Animated, Easing, KeyboardAvoidingView, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, RADIUS, SHADOWS, FONT_SIZE, FONT_WEIGHT } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

const MOCK_USERS = [
  { name: 'Nguyễn Văn An', email: 'vananh@gmail.com', password: 'Bus2026' },
  { name: 'Trần Thu Hà', email: 'ha.tran@example.com', password: 'Ha2026#' },
];

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

  // Animations
  const busPosition = useRef(new Animated.Value(-100)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(40)).current;
  const logoScale = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    // Bus animation loop
    const runBus = () => {
      busPosition.setValue(-120);
      Animated.timing(busPosition, {
        toValue: width + 120, duration: 5000,
        easing: Easing.linear, useNativeDriver: true,
      }).start(() => runBus());
    };
    runBus();

    // Logo bounce
    Animated.spring(logoScale, {
      toValue: 1, friction: 5, tension: 45, useNativeDriver: true,
    }).start();

    // Form slide up
    Animated.parallel([
      Animated.timing(formOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(formTranslateY, {
        toValue: 0, duration: 500,
        easing: Easing.out(Easing.cubic), useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập email và mật khẩu.');
      return;
    }
    const user = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );
    if (!user) {
      Alert.alert('Đăng nhập thất bại', 'Email hoặc mật khẩu không đúng.');
      return;
    }

    router.replace('/(tabs)');
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* ── HERO BG ── */}
      <View style={styles.heroBg}>
        <View style={styles.heroCircle1} />
        <View style={styles.heroCircle2} />
        <View style={styles.heroCircle3} />

        {/* Animated bus */}
        <Animated.View style={[styles.animBus, { transform: [{ translateX: busPosition }] }]}>
          <Ionicons name="bus" size={28} color="rgba(255,255,255,0.35)" />
          <View style={styles.busDash} />
        </Animated.View>

        {/* Logo + headline */}
        <SafeAreaView style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
          <View style={styles.heroContent}>
            <Animated.View style={[styles.logoBubble, { transform: [{ scale: logoScale }] }]}>
              <Ionicons name="bus" size={34} color={COLORS.primary} />
            </Animated.View>
            <Text style={styles.brandName}>Vân Anh Bus</Text>
            <Text style={styles.heroTagline}>Chào mừng trở lại! 👋</Text>
            <Text style={styles.heroSub}>Đặt vé nhanh, đi đâu cũng tiện</Text>
          </View>
        </SafeAreaView>
      </View>

      {/* ── FORM CARD ── */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Animated.View style={[styles.formCard, { opacity: formOpacity, transform: [{ translateY: formTranslateY }] }]}>

            <Text style={styles.formTitle}>Đăng nhập</Text>
            <Text style={styles.formSub}>Nhập thông tin tài khoản của bạn</Text>

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email</Text>
              <View style={[styles.inputWrap, emailFocused && styles.inputWrapFocused]}>
                <View style={styles.inputIcon}>
                  <Ionicons name="mail-outline" size={18} color={emailFocused ? COLORS.primary : COLORS.textTertiary} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập email của bạn"
                  placeholderTextColor={COLORS.textTertiary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Mật khẩu</Text>
              <View style={[styles.inputWrap, passFocused && styles.inputWrapFocused]}>
                <View style={styles.inputIcon}>
                  <Ionicons name="lock-closed-outline" size={18} color={passFocused ? COLORS.primary : COLORS.textTertiary} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập mật khẩu"
                  placeholderTextColor={COLORS.textTertiary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  onFocus={() => setPassFocused(true)}
                  onBlur={() => setPassFocused(false)}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color={COLORS.textTertiary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Quên mật khẩu?</Text>
            </TouchableOpacity>

            {/* Demo hint */}
            <View style={styles.demoBox}>
              <Ionicons name="information-circle-outline" size={15} color={COLORS.primary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.demoTitle}>Tài khoản thử nghiệm</Text>
                <Text style={styles.demoText}>Khách: vananh@gmail.com · Bus2026</Text>
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} activeOpacity={0.85}>
              <Text style={styles.loginBtnText}>Đăng nhập</Text>
              <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Hoặc tiếp tục với</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social */}
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialBtn} activeOpacity={0.75}>
                <Ionicons name="logo-google" size={20} color="#DB4437" />
                <Text style={styles.socialBtnText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn} activeOpacity={0.75}>
                <Ionicons name="logo-facebook" size={20} color="#4267B2" />
                <Text style={styles.socialBtnText}>Facebook</Text>
              </TouchableOpacity>
            </View>

            {/* Register */}
            <View style={styles.registerRow}>
              <Text style={styles.registerPrompt}>Chưa có tài khoản? </Text>
              <TouchableOpacity onPress={() => router.push('/auth/register')}>
                <Text style={styles.registerLink}>Đăng ký ngay</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },

  // Hero
  heroBg: {
    backgroundColor: COLORS.primary,
    height: 300, overflow: 'hidden',
    borderBottomLeftRadius: 36, borderBottomRightRadius: 36,
  },
  heroCircle1: {
    position: 'absolute', width: 240, height: 240, borderRadius: 120,
    backgroundColor: 'rgba(255,255,255,0.07)', top: -70, right: -60,
  },
  heroCircle2: {
    position: 'absolute', width: 150, height: 150, borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.05)', top: 120, left: -40,
  },
  heroCircle3: {
    position: 'absolute', width: 90, height: 90, borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.06)', bottom: -10, right: 80,
  },
  animBus: { position: 'absolute', top: 110, flexDirection: 'row', alignItems: 'center' },
  busDash: {
    position: 'absolute', right: 32, width: 55, height: 2,
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2,
  },
  heroContent: { alignItems: 'center', paddingTop: SPACING.xl },
  logoBubble: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: COLORS.white,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: SPACING.md, ...SHADOWS.medium,
  },
  brandName: {
    fontSize: FONT_SIZE.xxl, fontWeight: FONT_WEIGHT.black,
    color: COLORS.white, letterSpacing: -0.5,
  },
  heroTagline: {
    fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white, marginTop: 4,
  },
  heroSub: {
    fontSize: FONT_SIZE.sm, color: 'rgba(255,255,255,0.75)',
    fontWeight: FONT_WEIGHT.medium, marginTop: 4,
  },

  // Scroll
  scrollContent: { flexGrow: 1, paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg, paddingBottom: SPACING.xxl },

  // Form card
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xxl, padding: SPACING.xl, ...SHADOWS.large,
  },
  formTitle: { fontSize: FONT_SIZE.xxl, fontWeight: FONT_WEIGHT.extrabold, color: COLORS.textPrimary },
  formSub: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, marginTop: 4, marginBottom: SPACING.xl },

  // Fields
  fieldGroup: { marginBottom: SPACING.md + 4 },
  fieldLabel: {
    fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary, marginBottom: SPACING.sm,
  },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: RADIUS.lg, height: 56,
    borderWidth: 1.5, borderColor: COLORS.border,
    paddingHorizontal: SPACING.md, gap: SPACING.sm,
  },
  inputWrapFocused: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  inputIcon: {
    width: 28, height: 28, borderRadius: RADIUS.sm,
    justifyContent: 'center', alignItems: 'center',
  },
  input: { flex: 1, fontSize: FONT_SIZE.md, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.medium },
  eyeBtn: { padding: 4 },

  forgotBtn: { alignSelf: 'flex-end', marginBottom: SPACING.lg },
  forgotText: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.bold, color: COLORS.primary },

  demoBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm,
    backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.lg,
    padding: SPACING.md, marginBottom: SPACING.lg,
    borderWidth: 1, borderColor: COLORS.primaryMid,
  },
  demoTitle: { fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.bold, color: COLORS.primaryDark, marginBottom: 2 },
  demoText: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary },

  loginBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.primary, height: 56,
    borderRadius: RADIUS.lg, gap: SPACING.sm,
    marginBottom: SPACING.xl, ...SHADOWS.colored,
  },
  loginBtnText: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, color: COLORS.white },

  dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.lg, gap: SPACING.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, fontWeight: FONT_WEIGHT.semibold },

  socialRow: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.xl },
  socialBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    height: 50, borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surfaceSecondary,
    borderWidth: 1.5, borderColor: COLORS.border, gap: SPACING.sm,
  },
  socialBtnText: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.bold, color: COLORS.textPrimary },

  registerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  registerPrompt: { fontSize: FONT_SIZE.md, color: COLORS.textSecondary },
  registerLink: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, color: COLORS.primary },
});
