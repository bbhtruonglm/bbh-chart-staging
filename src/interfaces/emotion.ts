/**gợi ý hành động */
interface EmotionSuggestions {
  /**xin lỗi khách hàng */
  apologize_customer?: boolean
  /**cải thiện dịch vụ CSKH */
  improve_support?: boolean
  /**điều tra nguyên nhân vấn đề */
  investigate_issue?: boolean
  /**cập nhật đơn hàng */
  update_customer?: boolean
  /**đào tạo lại nhân sự */
  enhance_training?: boolean
  /**nâng cao chất lượng sản phẩm */
  maintain_quality?: boolean
  /**khác */
  other?: boolean
}
/**vấn đề gặp phải */
interface CommonIssuesProps {
  /**chất lượng sản phẩm */
  product_quality?: boolean
  /**giao hàng */
  delivery_issues?: boolean
  /**dịch vụ khách hàng */
  customer_service?: boolean
  /**giá */
  pricing_concerns?: boolean
  /**kỹ thuật */
  technical_issues?: boolean
  /**hoàn tiền */
  refund_request?: boolean
  /**khác */
  other?: boolean
}
