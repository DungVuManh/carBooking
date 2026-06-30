import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, RADIUS, SHADOWS, FONT_SIZE, FONT_WEIGHT } from '@/constants/theme';

const { width } = Dimensions.get('window');

const MOCK_USERS = [
  {
    name: 'Nguyễn Văn An',
    email: 'vananh@gmail.com',
    password: 'Bus2026',
  },
  {
    name: 'Trần Thu Hà',
    email: 'ha.tran@example.com',
    password: 'Ha2026#',
  },
];

/**
 * LoginScreen - Màn hình đăng nhập (UC01)
 *
 * Bản nâng cấp UI Cao cấp + Animation:
 * - Hiệu ứng xe khách chạy ngang màn hình (Header).
 * - Form Card trượt từ dưới lên mượt mà (FadeIn & SlideUp).
 * - Biểu tượng Logo nảy lên (Bounce) khi vừa vào app.
 */
export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Khởi tạo các giá trị Animation
  const busPosition = useRef(new Animated.Value(-100)).current; // Vị trí xe khách (bắt đầu ngoài màn hình trái)
  const formOpacity = useRef(new Animated.Value(0)).current;    // Độ mờ của form (hiện dần)
  const formTranslateY = useRef(new Animated.Value(50)).current; // Vị trí form (trượt lên)
  const logoScale = useRef(new Animated.Value(0)).current;       // Phóng to logo

  useEffect(() => {
    // 1. Animation Xe khách chạy ngang (Lặp vô hạn)
    const runBusAnimation = () => {
      busPosition.setValue(-100);
      Animated.timing(busPosition, {
        toValue: width + 100, // Chạy quá màn hình bên phải
        duration: 4000,       // Chạy trong 4 giây
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => runBusAnimation()); // Lặp lại khi xong
    };
    runBusAnimation();

    // 2. Animation Logo Bounce
    Animated.spring(logoScale, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();

    // 3. Animation Form Slide Up
    Animated.parallel([
      Animated.timing(formOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(formTranslateY, {
        toValue: 0, // Trở về vị trí gốc
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    const user = MOCK_USERS.find(
      (item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password,
    );

    if (!user) {
      Alert.alert('Đăng nhập không thành công', 'Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
      return;
    }

    // Success: login with local mock user data and navigate to app tabs
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      {/* ── HEADER NỀN XANH CÓ ANIMATION ── */}
      <View style={styles.headerBackground}>
        {/* Các hình tròn trang trí (Abstract shapes) */}
        <View style={styles.circle1} />
        <View style={styles.circle2} />
        <View style={styles.circle3} />

        {/* 🚐 Xe khách chạy ngang nền trời */}
        <Animated.View style={[styles.animatedBus, { transform: [{ translateX: busPosition }] }]}>
          <Ionicons name="bus" size={32} color="rgba(255,255,255,0.4)" />
          {/* Vạch kẻ đường phía sau xe */}
          <View style={styles.busDash} />
        </Animated.View>

        {/* Tiêu đề & Logo (bỏ nút back vì đây là màn hình đầu) */}
        <SafeAreaView style={styles.headerSafeArea}>
          <View style={styles.headerContent}>
            {/* Animated Logo */}
            <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoScale }] }]}>
              <Ionicons name="bus" size={36} color={COLORS.primary} />
            </Animated.View>
            <Text style={styles.headerTitle}>Chào mừng trở lại!</Text>
            <Text style={styles.headerSubtitle}>Vân Anh Bus đồng hành cùng bạn</Text>
          </View>
        </SafeAreaView>
      </View>

      {/* ── FORM ĐĂNG NHẬP (Animated) ── */}
      <Animated.View
        style={[
          styles.formCard,
          {
            opacity: formOpacity,
            transform: [{ translateY: formTranslateY }],
          },
        ]}
      >
        <View style={styles.formContent}>
          {/* Input Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color={COLORS.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Nhập email của bạn"
                placeholderTextColor={COLORS.textTertiary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Input Mật khẩu */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mật khẩu</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Nhập mật khẩu"
                placeholderTextColor={COLORS.textTertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Quên mật khẩu */}
          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Quên mật khẩu?</Text>
          </TouchableOpacity>

          <View style={styles.demoInfo}>
            <Text style={styles.demoLabel}>Tài khoản dùng thử</Text>
            <Text style={styles.demoText}>vananh@gmail.com · Bus2026</Text>
          </View>

          {/* Nút Đăng nhập có gradient giả (màu primary sáng) */}
          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} activeOpacity={0.8}>
            <Text style={styles.loginBtnText}>Đăng nhập</Text>
            <Ionicons name="arrow-forward" size={20} color={COLORS.white} style={{ marginLeft: 8 }} />
          </TouchableOpacity>

          {/* Đăng nhập Mạng xã hội */}
          <View style={styles.socialSection}>
            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>Hoặc tiếp tục với</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.socialButtons}>
              <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
                <Ionicons name="logo-google" size={22} color="#DB4437" />
                <Text style={styles.socialBtnText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
                <Ionicons name="logo-facebook" size={22} color="#4267B2" />
                <Text style={styles.socialBtnText}>Facebook</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Bạn chưa có tài khoản? </Text>
        <TouchableOpacity onPress={() => router.push('/auth/register')}>
          <Text style={styles.registerLink}>Đăng ký ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  // ── HEADER VÀ HIỆU ỨNG ──
  headerBackground: {
    backgroundColor: COLORS.primary,
    height: 330,
    width: '100%',
    position: 'absolute',
    top: 0,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  headerGradientShape: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.18)',
    top: -70,
    right: -50,
  },
  headerSoftBubble: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.12)',
    top: 90,
    left: -50,
  },
  headerGlowBar: {
    position: 'absolute',
    width: '55%',
    height: 18,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
    top: 140,
    left: 24,
  },
  animatedBus: {
    position: 'absolute',
    top: 120,
    flexDirection: 'row',
    alignItems: 'center',
  },
  busDash: {
    position: 'absolute',
    right: 36, // Đặt phía sau xe
    width: 60,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
  },
  circle1: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: -50,
    right: -80,
  },
  circle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.04)',
    top: 150,
    left: -40,
  },
  circle3: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: -20,
    right: 80,
  },
  headerSafeArea: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerContent: {
    alignItems: 'center',
    paddingTop: SPACING.xxl, // Thay vì margin top cho back btn, đẩy content xuống
  },
  logoContainer: {
    width: 76,
    height: 76,
    backgroundColor: COLORS.white,
    borderRadius: 38,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: FONT_WEIGHT.extrabold,
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 6,
    fontWeight: FONT_WEIGHT.medium,
  },

  // ── FORM CARD (ANIMATED) ──
  formCard: {
    flex: 1,
    marginTop: 240, // Đẩy xuống đè lên mép viền cong
  },
  formContent: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl, // Rộng rãi hơn
    ...SHADOWS.large,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs + 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 56, // Cao hơn một chút cho cảm giác click dễ hơn
    borderWidth: 1.5,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.medium,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.xl,
  },
  forgotText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
  },
  loginBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    ...SHADOWS.medium,
  },
  loginBtnText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
  },

  // ── SOCIAL LOGIN ──
  demoInfo: {
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.primaryLight,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(26,111,219,0.16)',
  },
  demoLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.primaryDark,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: SPACING.xs,
  },
  demoText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
  },
  socialSection: {
    marginBottom: SPACING.xs,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    marginHorizontal: SPACING.md,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 0.5,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  socialBtnText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },

  // ── FOOTER ──
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    marginTop: 'auto',
  },
  footerText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.medium,
  },
  registerLink: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
  },
});
