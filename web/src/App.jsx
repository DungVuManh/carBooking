import './App.css';
import { AdminDashboard } from './components/admin/AdminDashboard.jsx';
import { AdminLoginScreen } from './components/admin/AdminLoginScreen.jsx';
import { useAdminAuth } from './hooks/useAdminAuth.js';
import { useAdminDashboard } from './hooks/useAdminDashboard.js';

function App() {
  const {
    isLoggedIn,
    email,
    setEmail,
    password,
    setPassword,
    authError,
    handleLogin,
    handleLogout: handleAuthLogout,
  } = useAdminAuth();

  const {
    activeTab,
    setActiveTab,
    routes,
    trips,
    tickets,
    chats,
    routeModalVisible,
    tripModalVisible,
    editingRoute,
    editingTrip,
    routeFrom,
    routeTo,
    routeDistance,
    routeDuration,
    tripRouteId,
    tripDepTime,
    tripArrTime,
    tripPrice,
    tripBusType,
    tripBusNumber,
    tripCompany,
    replyText,
    chatBottomRef,
    adminNotifications,
    simulateClientMessage,
    handleOpenAddRoute,
    handleOpenEditRoute,
    handleSaveRoute,
    handleDeleteRoute,
    handleOpenAddTrip,
    handleOpenEditTrip,
    handleSaveTrip,
    handleDeleteTrip,
    handleConfirmBoarding,
    handleSendReply,
    stats,
    formatPrice,
    setRouteFrom,
    setRouteTo,
    setRouteDistance,
    setRouteDuration,
    setTripRouteId,
    setTripDepTime,
    setTripArrTime,
    setTripPrice,
    setTripBusType,
    setTripBusNumber,
    setTripCompany,
    setReplyText,
    setRouteModalVisible,
    setTripModalVisible,
  } = useAdminDashboard();

  const handleLogout = () => {
    handleAuthLogout();
    setActiveTab('stats');
  };

  const handleRouteFormChange = (field, value) => {
    if (field === 'from') setRouteFrom(value);
    if (field === 'to') setRouteTo(value);
    if (field === 'distance') setRouteDistance(value);
    if (field === 'duration') setRouteDuration(value);
  };

  const handleTripFormChange = (field, value) => {
    if (field === 'routeId') setTripRouteId(value);
    if (field === 'depTime') setTripDepTime(value);
    if (field === 'arrTime') setTripArrTime(value);
    if (field === 'price') setTripPrice(value);
    if (field === 'busType') setTripBusType(value);
    if (field === 'busNumber') setTripBusNumber(value);
    if (field === 'company') setTripCompany(value);
  };

  const handleLoginSubmit = (e) => {
    handleLogin(e);
  };

  if (!isLoggedIn) {
    return (
      <AdminLoginScreen
        email={email}
        password={password}
        authError={authError}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={handleLoginSubmit}
      />
    );
  }

  return (
    <AdminDashboard
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      routes={routes}
      trips={trips}
      tickets={tickets}
      chats={chats}
      routeModalVisible={routeModalVisible}
      tripModalVisible={tripModalVisible}
      editingRoute={editingRoute}
      editingTrip={editingTrip}
      routeFrom={routeFrom}
      routeTo={routeTo}
      routeDistance={routeDistance}
      routeDuration={routeDuration}
      tripRouteId={tripRouteId}
      tripDepTime={tripDepTime}
      tripArrTime={tripArrTime}
      tripPrice={tripPrice}
      tripBusType={tripBusType}
      tripBusNumber={tripBusNumber}
      tripCompany={tripCompany}
      replyText={replyText}
      chatBottomRef={chatBottomRef}
      adminNotifications={adminNotifications}
      stats={stats}
      formatPrice={formatPrice}
      onLogout={handleLogout}
      onSimulateClientMessage={simulateClientMessage}
      onOpenAddRoute={handleOpenAddRoute}
      onOpenEditRoute={handleOpenEditRoute}
      onDeleteRoute={handleDeleteRoute}
      onOpenAddTrip={handleOpenAddTrip}
      onOpenEditTrip={handleOpenEditTrip}
      onDeleteTrip={handleDeleteTrip}
      onConfirmBoarding={handleConfirmBoarding}
      onSendReply={handleSendReply}
      onRouteModalClose={() => setRouteModalVisible(false)}
      onTripModalClose={() => setTripModalVisible(false)}
      onRouteFormChange={handleRouteFormChange}
      onTripFormChange={handleTripFormChange}
      onSaveRoute={handleSaveRoute}
      onSaveTrip={handleSaveTrip}
      onReplyTextChange={setReplyText}
    />
  );
}

export default App;
