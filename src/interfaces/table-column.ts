/**
 * Dữ liệu của 1 user
 */
export type User =
  /**
   * Dữ liệu của 1 user
   */

  {
    /**
     * ID của nhân viên.
     * @type {string | null}
     */
    staff_id_column: string | null
    /**
     * Ngày liên quan đến người dùng.
     * @type {string | null}
     */
    date: string | null

    /**
     * Bình luận của khách hàng.
     * @type {string | null}
     */
    comment_client: string | null

    /**
     * Bình luận của trang.
     * @type {string | null}
     */
    comment_page: string | null

    /**
     * Bình luận của nhân viên.
     * @type {string | null}
     */
    comment_employee: string | null

    /**
     * Tin nhắn của nhân viên.
     * @type {string | null}
     */
    message_employee: string | null

    /**
     * Bình luận tin nhắn riêng tư.
     * @type {string | null}
     */
    comment_private_message: string | null

    /**
     * Tin nhắn của khách hàng.
     * @type {string | null}
     */
    message_client: string | null

    /**
     * Tin nhắn của trang.
     * @type {string | null}
     */
    message_page: string | null

    /**
     * Tin nhắn trả lời của nhân viên.
     * @type {string | null}
     */
    employee_reply_message: string | null

    /**
     * Số điện thoại được AI phát hiện.
     * @type {string | null}
     */
    phone_ai_detect: string | null

    /**
     * Địa chỉ được AI phát hiện.
     * @type {string | null}
     */
    address_ai_detect: string | null

    /**
     * Giao dịch được AI phát hiện.
     * @type {string | null}
     */
    transaction_ai_detect: string | null

    /**
     * Luồng hoạt động.
     * @type {string | null}
     */
    flow_active: string | null

    /**
     * Số điện thoại duy nhất.
     * @type {string | null}
     */
    unique_phone_numbers: string | null

    /**
     * Email được AI phát hiện.
     * @type {string | null}
     */
    email_ai_detect: string | null

    /**
     * Khách hàng duy nhất.
     * @type {string | null}
     */
    client_unique: string | null

    /**
     * Khách hàng quay lại.
     * @type {string | null}
     */
    client_return: string | null

    /**
     * Nhãn đã thêm.
     * @type {string | null}
     */
    label_add: string | null

    /**
     * Nhãn đã xóa.
     * @type {string | null}
     */
    label_remove: string | null

    /**
     * Tiếp cận quảng cáo.
     * @type {string | null}
     */
    ad_reach: string | null

    /**
     * Phản hồi chậm.
     * @type {string | null}
     */
    slow_response: string | null

    /**
     * Phản hồi chậm được AI phát hiện.
     * @type {string | null}
     */
    ai_slow_response: string | null

    /**
     * Tỷ lệ khách hàng mới quay lại.
     * @type {string | null}
     */
    returning_new_customer_ratio: string | null

    /**
     * Tỷ lệ khách hàng quay lại.
     * @type {string | null}
     */
    returning_customer_ratio: string | null

    /**
     * Tỷ lệ chuyển đổi duy nhất.
     * @type {string | null}
     */
    conversion_rate_unique: string | null

    /**
     * Thời gian phản hồi trung bình.
     * @type {string | null}
     */
    average_response_time: string | null

    /**
     * Phản hồi chậm được AI phát hiện.
     * @type {string | null}
     */
    ai_delayed_responses: string | null

    /**
     * Phản hồi tích cực từ khách hàng.
     * @type {string | null}
     */
    client_positive: string | null

    /**
     * Phản hồi tiêu cực từ khách hàng.
     * @type {string | null}
     */
    client_negative: string | null

    /**
     * Lịch trình được AI phát hiện.
     * @type {string | null}
     */
    schedule_ai_detect: string | null

    /**
     * Lịch trình đã tạo.
     * @type {string | null}
     */
    created_schedules: string | null

    /**
     * Đơn hàng được AI phát hiện.
     * @type {string | null}
     */
    order_ai_detect: string | null

    /**
     * Đơn hàng đã tạo.
     * @type {string | null}
     */
    created_orders: string | null

    /**
     * Vé được AI đề xuất.
     * @type {string | null}
     */
    ai_suggested_tickets: string | null

    /**
     * Vé đã tạo.
     * @type {string | null}
     */
    created_tickets: string | null

    /**
     * Vé đang xử lý.
     * @type {string | null}
     */
    tickets_in_progress: string | null

    /**
     * Vé đã giải quyết.
     * @type {string | null}
     */
    resolved_tickets: string | null

    /** (AI) đề xuất lập lịch */
    cta_schedule_ai_detect: string | null
    /** (AI) đề xuất đặt hàng */
    cta_order_ai_detect: string | null
    /** (AI) đề xuất giao dịch */
    cta_transaction_ai_detect: string | null
    /** (AI) tài liệu */
    cta_document_ai_detect: string | null
    /** (AI) link */
    cta_link_ai_detect: string | null
    /** (AI) bán hàng */
    cta_sale_ai_detect: string | null
    /** (AI) vận chuyển */
    cta_shipping_ai_detect: string | null
    /** Chậm gọi trong giờ hành chính */
    staff_miss_call_in_hours: string | null
    /** chậm gọi ngoài giờ hành chính */
    staff_miss_call_out_hours: string | null
    /**  chậm trả lời trong giờ hành chính */
    staff_miss_response_in_hours: string | null
    /** chậm trả lời ngoài giờ hành chính */
    staff_miss_response_out_hours: string | null
  }
/**
 * Dữ liệu của 1 user
 */
export type AnalyticEvent =
  /** nhãn kích hoạt */
  | 'label_add'
  /**  nhãn huỷ */
  | 'label_remove'
  /**  tin nhắn private từ bình luận */
  | 'comment_private_message'
  /**  khách hàng cũ */
  | 'client_return'
  /**  bình luận từ khách hàng */
  | 'comment_client'
  /**  bình luận từ trang */
  | 'comment_page'
  /**  bình luận từ nhân viên */
  | 'comment_employee'
  /**  tin nhắn từ khách hàng */
  | 'message_client'
  /**  tin nhắn từ trang */
  | 'message_page'
  /**  tin nhắn từ nhân viên */
  | 'message_employee'
  /**  khách hàng mới */
  | 'client_unique'
  /**  số lượt tiếp cận quảng cáo */
  | 'ad_reach'
  /**  (AI) tổng số điện thoại */
  | 'phone_ai_detect'
  /**  (AI) tổng số email */
  | 'email_ai_detect'
  /**  (AI) tổng số địa chỉ */
  | 'address_ai_detect'
  /**  (AI) cảm xúc vui vẻ */
  | 'client_emotion_happy'
  /**  (AI) cảm xúc buồn */
  | 'client_emotion_sad'
  /**  (AI) cảm xúc sợ hãi */
  | 'client_emotion_fear'
  /**  (AI) cảm xúc giận dữ */
  | 'client_emotion_angry'
  /**  (AI) cảm xúc ngạc nhiên */
  | 'client_emotion_surprise'
  /**  (AI) cảm xúc ghê tởm */
  | 'client_emotion_disgust'
  /**  (AI) cảm xúc yêu thương */
  | 'client_emotion_love'
  /**  (AI) cảm xúc ghen tức */
  | 'client_emotion_jealousy'
  /**  (AI) cảm xúc xấu hổ */
  | 'client_emotion_shame'
  /**  (AI) cảm xúc tự hào */
  | 'client_emotion_pride'
  /**  (AI) không có cảm xúc */
  | 'client_emotion_none'
  /**  (AI) số lần khách hàng không hài lòng */
  | 'client_positive'
  /**  (AI) số lần khách hàng hài lòng */
  | 'client_negative'
  /**  (AI) số lần khách hàng trung lập */
  | 'client_neutral'
  /**  (AI) đề xuất lập lịch */
  | 'schedule_ai_detect'
  /**  (AI) đề xuất đặt hàng */
  | 'order_ai_detect'
  /**  (AI) đề xuất giao dịch */
  | 'transaction_ai_detect'
  /**  (AI) prompt text đã sử dụng */
  | 'ai_prompt_text'
  /**  (AI) prompt image đã sử dụng */
  | 'ai_prompt_image'
  /**  (AI) prompt sound đã sử dụng */
  | 'ai_prompt_sound'
  /**  (AI) prompt video đã sử dụng */
  | 'ai_prompt_video'
  /**  FAU đã sử dụng */
  | 'flow_active'
  /**  Số lần trả lời chậm */
  | 'slow_response'
  /**  (AI) Số lần trả lời chậm */
  | 'ai_slow_response'
  /**  (AI) đề xuất lập lịch */
  | 'cta_schedule_ai_detect'
  /**  (AI) đề xuất đặt hàn */
  | 'cta_order_ai_detect'
  /**  (AI) đề xuất giao dịch */
  | 'cta_transaction_ai_detect'
  /**  (AI) tài liệu */
  | 'cta_document_ai_detect'
  /**  (AI) link */
  | 'cta_link_ai_detect'
  /**  (AI) bán hàng */
  | 'cta_sale_ai_detect'
  /**  (AI) vận chuyển */
  | 'cta_shipping_ai_detect'
  | null
