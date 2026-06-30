import { AlertCircle, Bus, Lock, Mail, Sparkles } from 'lucide-react';

export function AdminLoginScreen({
  email,
  password,
  authError,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}) {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <Bus size={28} color="white" />
          </div>
          <h2 className="auth-title">Vân Anh Bus</h2>
          <p className="auth-sub">Hệ Thống Web Portal Admin</p>
        </div>

        {authError && (
          <div className="auth-error">
            <AlertCircle size={18} />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="auth-form-group">
            <label className="auth-label">Email Admin</label>
            <div className="auth-input-wrapper">
              <div className="auth-input-icon">
                <Mail size={18} />
              </div>
              <input
                type="email"
                className="auth-input"
                placeholder="admin@gmail.com"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                id="admin_email"
              />
            </div>
          </div>

          <div className="auth-form-group">
            <label className="auth-label">Mật khẩu</label>
            <div className="auth-input-wrapper">
              <div className="auth-input-icon">
                <Lock size={18} />
              </div>
              <input
                type="password"
                className="auth-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                id="admin_password"
              />
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" id="login_submit">
            Đăng nhập Hệ thống
          </button>
        </form>

        <div className="auth-demo-box">
          <div className="auth-demo-title">
            <Sparkles size={14} />
            <span>Tài khoản thử nghiệm Admin</span>
          </div>
          <p className="auth-demo-text">Email: <strong>admin@gmail.com</strong></p>
          <p className="auth-demo-text">Mật khẩu: <strong>Admin2026</strong></p>
        </div>
      </div>
    </div>
  );
}
