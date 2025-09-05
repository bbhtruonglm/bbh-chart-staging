// HeaderWithTooltip.tsx
import React from 'react'

type HeaderWithTooltipProps = {
  /** Label */
  label: string
  /** Hàm mouse enter */
  onHover?: (e: React.MouseEvent) => void
  /** Hàm leave */
  onLeave?: () => void
}

const HeaderWithTooltip: React.FC<HeaderWithTooltipProps> = ({
  label,
  onHover,
  onLeave,
}) => {
  return (
    <div
      onMouseEnter={e => onHover?.(e)}
      onMouseLeave={onLeave}
    >
      {label}
    </div>
  )
}

export default HeaderWithTooltip
