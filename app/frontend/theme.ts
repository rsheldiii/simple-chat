// Modern dark chat theme
// Custom color palette designed for readability and visual appeal
export const simpleChatTheme = {
    colors: {
        // Main backgrounds - warmer dark tones
        background: '#1a1d23',        // Main chat area - deep blue-gray
        sidebar: '#151821',          // Sidebar background - darker blue-gray  
        darker: '#0f1114',           // Darker sections - almost black with blue hint
        darkest: '#0c0e11',          // Darkest background
        
        // Text colors - slightly warmer whites
        textPrimary: '#e8eaed',      // Main text - soft white
        textSecondary: '#9aa0a6',    // Secondary text - medium gray
        textMuted: '#5f6368',        // Muted text - darker gray
        
        // Interactive elements - teal/cyan accent palette
        accent: '#00acc1',           // Main teal - distinctive from Discord blue
        accentHover: '#0097a7',      // Darker teal on hover
        success: '#4caf50',          // Material green
        warning: '#ff9800',          // Material orange
        danger: '#f44336',           // Material red
        
        // UI elements
        hover: '#262a31',            // Hover states - subtle highlight
        inputBackground: '#232831',   // Input backgrounds - slightly lighter
        border: '#3c4043',           // Borders - medium contrast
        scrollbar: '#1a1d23',        // Scrollbar track
        scrollbarThumb: '#5f6368',   // Scrollbar thumb
    },
    
    fonts: {
        primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        code: 'SF Mono, Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
    },
    
    shadows: {
        elevation1: '0 1px 3px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.1)',
        elevation2: '0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)',
        elevation3: '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)',
    },
    
    borderRadius: {
        small: '6px',
        medium: '10px', 
        large: '16px',
        round: '50%',
    },
    
    spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
    },
};

export type SimpleChatTheme = typeof simpleChatTheme; 