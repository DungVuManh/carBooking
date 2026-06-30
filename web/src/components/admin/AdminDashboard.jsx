import {
  BarChart3,
  Bell,
  Bus,
  CheckSquare,
  DollarSign,
  Edit3,
  LogOut,
  Map,
  MapPin,
  MessageSquare,
  Plus,
  Send,
  Ticket as TicketIcon,
  Trash2,
  X,
} from 'lucide-react';

export function AdminDashboard({
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
  stats,
  formatPrice,
  onLogout,
  onSimulateClientMessage,
  onOpenAddRoute,
  onOpenEditRoute,
  onDeleteRoute,
  onOpenAddTrip,
  onOpenEditTrip,
  onDeleteTrip,
  onConfirmBoarding,
  onSendReply,
  onRouteModalClose,
  onTripModalClose,
  onRouteFormChange,
  onTripFormChange,
  onSaveRoute,
  onSaveTrip,
  onReplyTextChange,
}) {
  const { totalSold, totalRevenue, pendingCount, cancelledCount } = stats;

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Bus size={22} color="white" />
          </div>
          <span className="brand-name">Nhà Xe Toàn Quang</span>
        </div>

        <nav className="sidebar-nav">
          <div className={`nav-item ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')} id="nav_stats">
            <BarChart3 size={18} />
            <span>Báo cáo doanh số</span>
          </div>
          <div className={`nav-item ${activeTab === 'routes' ? 'active' : ''}`} onClick={() => setActiveTab('routes')} id="nav_routes">
            <Map size={18} />
            <span>Quản lý Tuyến đường</span>
          </div>
          <div className={`nav-item ${activeTab === 'trips' ? 'active' : ''}`} onClick={() => setActiveTab('trips')} id="nav_trips">
            <Bus size={18} />
            <span>Quản lý Chuyến xe</span>
          </div>
          <div className={`nav-item ${activeTab === 'tickets' ? 'active' : ''}`} onClick={() => setActiveTab('tickets')} id="nav_tickets">
            <TicketIcon size={18} />
            <span>Boarding & Vé xe</span>
          </div>
          <div className={`nav-item ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')} id="nav_chat">
            <MessageSquare size={18} />
            <span>Phản hồi CSKH</span>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="admin-profile">
            <div className="admin-avatar">AD</div>
            <div className="admin-info">
              <span className="admin-name">Quản trị viên</span>
              <span className="admin-role">Chủ nhà xe</span>
            </div>
          </div>
          <button className="logout-btn" onClick={onLogout} id="logout_btn">
            <LogOut size={16} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      <div className="main-content">
        {adminNotifications.length > 0 && (
          <div className="notification-banner">
            <div className="notification-message">
              <Bell size={18} />
              <span>{adminNotifications[0].text}</span>
            </div>
            <button className="notification-action" onClick={() => setActiveTab('chat')}>
              Phản hồi ngay
            </button>
          </div>
        )}

        <header className="header">
          <div className="header-title-wrap">
            <h1>
              {activeTab === 'stats' && 'Báo cáo Thống kê Doanh số '}
              {activeTab === 'routes' && 'Quản lý các Tuyến đường '}
              {activeTab === 'trips' && 'Quản lý các Chuyến xe '}
              {activeTab === 'tickets' && 'Đơn đặt vé & Boarding hành khách '}
              {activeTab === 'chat' && 'Trung tâm Hỗ trợ & CSKH '}
            </h1>
          </div>
          <div className="header-actions">
            <span className="badge info">Cập nhật lúc: 2026-07-01</span>
          </div>
        </header>

        <main className="tab-panel">
          {activeTab === 'stats' && (
            <section id="stats_panel">
              <div className="section-header">
                <h2 className="section-title">Tổng quan doanh thu hôm nay</h2>
                <button className="simulate-btn" onClick={onSimulateClientMessage} id="simulate_msg_btn">
                  <Bell size={16} />
                  <span>Simulate Client Message (UC16)</span>
                </button>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon primary"><DollarSign size={24} /></div>
                  <div className="stat-info">
                    <span className="stat-value">{formatPrice(totalRevenue)}</span>
                    <span className="stat-label">Tổng doanh thu</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon success"><TicketIcon size={24} /></div>
                  <div className="stat-info">
                    <span className="stat-value">{totalSold}</span>
                    <span className="stat-label">Vé đã bán (Boarded)</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon warning"><Bell size={24} /></div>
                  <div className="stat-info">
                    <span className="stat-value">{pendingCount}</span>
                    <span className="stat-label">Chờ thanh toán</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon danger"><X size={24} /></div>
                  <div className="stat-info">
                    <span className="stat-value">{cancelledCount}</span>
                    <span className="stat-label">Vé đã hủy</span>
                  </div>
                </div>
              </div>

              <div className="chart-section">
                <div className="chart-header">
                  <h3 className="chart-title">Thống kê doanh số các tháng gần đây</h3>
                </div>
                <div className="chart-bar-container">
                  {[
                    { label: 'Tháng 4', value: 8200000, height: '45%' },
                    { label: 'Tháng 5', value: 12500000, height: '65%' },
                    { label: 'Tháng 6', value: 18400000, height: '90%' },
                    { label: 'Tháng 7 (Thực tế)', value: totalRevenue, height: '80%', highlight: true },
                  ].map((item, idx) => (
                    <div key={idx} className="chart-column">
                      <div className="chart-bar-wrapper">
                        <div className={`chart-bar ${item.highlight ? 'highlight' : ''}`} style={{ height: item.height }}></div>
                      </div>
                      <span className="chart-label">{item.label}</span>
                      <span className="chart-value">{formatPrice(item.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {activeTab === 'routes' && (
            <section id="routes_panel">
              <div className="section-header">
                <h2 className="section-title">Danh sách tuyến chạy hoạt động</h2>
                <button className="action-btn" onClick={onOpenAddRoute} id="add_route_btn">
                  <Plus size={16} />
                  <span>Tạo Tuyến chạy mới</span>
                </button>
              </div>

              <div className="grid-list">
                {routes.map((route) => (
                  <div key={route.id} className="data-card" id={`route_card_${route.id}`}>
                    <div className="data-card-details">
                      <div className="data-card-title">{route.from} ➔ {route.to}</div>
                      <div className="data-card-meta">
                        <div className="meta-item">
                          <MapPin size={14} />
                          <span>Khoảng cách: {route.distance}</span>
                        </div>
                        <div className="meta-item">
                          <span>Thời gian chạy: {route.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div className="data-card-actions">
                      <button className="btn-icon edit" onClick={() => onOpenEditRoute(route)} title="Sửa thông tin">
                        <Edit3 size={16} />
                      </button>
                      <button className="btn-icon delete" onClick={() => onDeleteRoute(route.id)} title="Xóa tuyến">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'trips' && (
            <section id="trips_panel">
              <div className="section-header">
                <h2 className="section-title">Danh sách chuyến chạy chi tiết</h2>
                <button className="action-btn" onClick={onOpenAddTrip} id="add_trip_btn">
                  <Plus size={16} />
                  <span>Thêm Chuyến chạy mới</span>
                </button>
              </div>

              <div className="grid-list">
                {trips.map((trip) => (
                  <div key={trip.id} className="data-card" id={`trip_card_${trip.id}`}>
                    <div className="data-card-details">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="badge primary">{trip.company}</span>
                        <span className="badge success">{trip.busNumber}</span>
                      </div>
                      <div className="data-card-title" style={{ marginTop: '4px' }}>{trip.from} ➔ {trip.to}</div>
                      <div className="data-card-meta">
                        <div className="meta-item">
                          <span>Khởi hành: <strong>{trip.departureTime}</strong> (Đến: {trip.arrivalTime})</span>
                        </div>
                        <div className="meta-item">
                          <span>Giá vé: <strong>{formatPrice(trip.price)}</strong></span>
                        </div>
                        <div className="meta-item">
                          <span>Loại xe: {trip.busType}</span>
                        </div>
                        <div className="meta-item">
                          <span>Ghế trống: {trip.availableSeats}/{trip.totalSeats}</span>
                        </div>
                      </div>
                    </div>
                    <div className="data-card-actions">
                      <button className="btn-icon edit" onClick={() => onOpenEditTrip(trip)} title="Sửa thông tin">
                        <Edit3 size={16} />
                      </button>
                      <button className="btn-icon delete" onClick={() => onDeleteTrip(trip.id)} title="Xóa chuyến">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'tickets' && (
            <section id="tickets_panel">
              <div className="section-header">
                <h2 className="section-title">Xác nhận khách hàng boarding lên xe</h2>
              </div>

              <div className="grid-list">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="data-card" id={`ticket_card_${ticket.id}`}>
                    <div className="data-card-details">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="ticket-passenger">Mã vé: #{ticket.id}</span>
                        <span className={`badge ${ticket.status === 'completed' ? 'success' : ticket.status === 'confirmed' ? 'primary' : ticket.status === 'cancelled' ? 'danger' : 'warning'}`}>
                          {ticket.status === 'completed' ? 'Đã lên xe' : ticket.status === 'confirmed' ? 'Đã đặt chỗ' : ticket.status === 'cancelled' ? 'Đã hủy' : 'Chờ thanh toán'}
                        </span>
                      </div>
                      <div className="data-card-title" style={{ marginTop: '4px', fontSize: '16px' }}>
                        Tuyến: {ticket.from} ➔ {ticket.to} ({ticket.company} - {ticket.busNumber})
                      </div>
                      <div className="data-card-meta">
                        <div className="meta-item">
                          <span>Khách hàng: <strong>{ticket.passengerName}</strong> ({ticket.passengerPhone})</span>
                        </div>
                        <div className="meta-item">
                          <span>Ghế: <strong>{ticket.seats.join(', ')}</strong></span>
                        </div>
                        <div className="meta-item">
                          <span>Tổng tiền: <strong>{formatPrice(ticket.totalPrice)}</strong></span>
                        </div>
                      </div>
                    </div>

                    {ticket.status !== 'cancelled' && (
                      <button className={`boarding-btn ${ticket.status === 'completed' ? 'completed' : ''}`} onClick={() => onConfirmBoarding(ticket.id)} disabled={ticket.status === 'completed'}>
                        <CheckSquare size={16} />
                        <span>{ticket.status === 'completed' ? 'Đã lên xe' : 'Xác nhận lên xe'}</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'chat' && (
            <section id="chat_panel">
              <div className="section-header">
                <h2 className="section-title">Trung tâm tư vấn & giải đáp thắc mắc</h2>
              </div>

              <div className="chat-container">
                <div className="chat-users-list">
                  <div className="chat-users-header">Hội thoại</div>
                  <div className="chat-user-item active">
                    <div className="chat-user-avatar">NA</div>
                    <div className="chat-user-info">
                      <span className="chat-user-name">Nguyễn Văn An</span>
                      <span className="chat-user-preview">{chats[chats.length - 1]?.content || 'Không có tin nhắn'}</span>
                    </div>
                  </div>
                </div>

                <div className="chat-window">
                  <div className="chat-window-header">
                    <div className="chat-user-avatar">NA</div>
                    <div>
                      <span className="chat-window-title">Nguyễn Văn An</span>
                      <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 600 }}>Đang hoạt động</div>
                    </div>
                  </div>

                  <div className="chat-messages">
                    {chats.map((msg) => (
                      <div key={msg.id} className={`chat-bubble-wrap ${msg.senderId === 'agent' ? 'outgoing' : 'incoming'}`}>
                        <div className="chat-bubble">{msg.content}</div>
                        <span className="chat-timestamp">
                          {msg.senderName} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                    <div ref={chatBottomRef} />
                  </div>

                  <form onSubmit={onSendReply} className="chat-input-area">
                    <input
                      type="text"
                      className="chat-text-input"
                      placeholder="Nhập nội dung phản hồi cho khách hàng..."
                      value={replyText}
                      onChange={(e) => onReplyTextChange(e.target.value)}
                      id="chat_input_text"
                    />
                    <button type="submit" className="chat-send-btn" id="chat_send_btn">
                      <Send size={16} />
                    </button>
                  </form>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {routeModalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{editingRoute ? 'Cập nhật Tuyến đường' : 'Tạo Tuyến chạy mới'}</h3>
              <button className="modal-close" onClick={onRouteModalClose}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Điểm đi</label>
                <input type="text" className="form-input" placeholder="VD: Hà Nội" value={routeFrom} onChange={(e) => onRouteFormChange('from', e.target.value)} id="modal_route_from" />
              </div>
              <div className="form-group">
                <label className="form-label">Điểm đến</label>
                <input type="text" className="form-input" placeholder="VD: Hải Phòng" value={routeTo} onChange={(e) => onRouteFormChange('to', e.target.value)} id="modal_route_to" />
              </div>
              <div className="form-group">
                <label className="form-label">Khoảng cách (km)</label>
                <input type="text" className="form-input" placeholder="VD: 120 km" value={routeDistance} onChange={(e) => onRouteFormChange('distance', e.target.value)} id="modal_route_distance" />
              </div>
              <div className="form-group">
                <label className="form-label">Thời gian dự kiến</label>
                <input type="text" className="form-input" placeholder="VD: 2h 30p" value={routeDuration} onChange={(e) => onRouteFormChange('duration', e.target.value)} id="modal_route_duration" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={onRouteModalClose}>Hủy</button>
              <button className="action-btn" onClick={onSaveRoute} id="modal_route_save">Lưu thông tin</button>
            </div>
          </div>
        </div>
      )}

      {tripModalVisible && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <h3 className="modal-title">{editingTrip ? 'Cập nhật Chuyến chạy' : 'Thêm Chuyến chạy mới'}</h3>
              <button className="modal-close" onClick={onTripModalClose}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Chọn Tuyến chạy</label>
                <select className="form-select" value={tripRouteId} onChange={(e) => onTripFormChange('routeId', e.target.value)} id="modal_trip_route_id">
                  {routes.map((r) => (
                    <option key={r.id} value={r.id}>{r.from} ➔ {r.to} ({r.distance})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Giờ xuất phát</label>
                  <input type="text" className="form-input" placeholder="VD: 06:00" value={tripDepTime} onChange={(e) => onTripFormChange('depTime', e.target.value)} id="modal_trip_dep_time" />
                </div>
                <div className="form-group">
                  <label className="form-label">Giờ dự kiến đến</label>
                  <input type="text" className="form-input" placeholder="VD: 09:30" value={tripArrTime} onChange={(e) => onTripFormChange('arrTime', e.target.value)} id="modal_trip_arr_time" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Giá vé (VND)</label>
                  <input type="number" className="form-input" placeholder="VD: 180000" value={tripPrice} onChange={(e) => onTripFormChange('price', e.target.value)} id="modal_trip_price" />
                </div>
                <div className="form-group">
                  <label className="form-label">Biển số xe</label>
                  <input type="text" className="form-input" placeholder="VD: 29B - 123.45" value={tripBusNumber} onChange={(e) => onTripFormChange('busNumber', e.target.value)} id="modal_trip_bus_number" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Dòng xe</label>
                  <input type="text" className="form-input" placeholder="VD: Limousine 34 chỗ" value={tripBusType} onChange={(e) => onTripFormChange('busType', e.target.value)} id="modal_trip_bus_type" />
                </div>
                <div className="form-group">
                  <label className="form-label">Nhà xe</label>
                  <input type="text" className="form-input" placeholder="VD: Xe Vân Anh" value={tripCompany} onChange={(e) => onTripFormChange('company', e.target.value)} id="modal_trip_company" />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={onTripModalClose}>Hủy</button>
              <button className="action-btn" onClick={onSaveTrip} id="modal_trip_save">Lưu thông tin</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
