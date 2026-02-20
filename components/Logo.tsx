import Link from 'next/link';

interface LogoProps {
    /** 'sm' = 40px, 'md' = 60px (default), 'lg' = 80px, 'xl' = 110px */
    size?: 'sm' | 'md' | 'lg' | 'xl';
    /** Wrap the logo in a link to / */
    linked?: boolean;
    /** Extra CSS classes on the wrapper div */
    className?: string;
    /** Apply a white filter (for dark backgrounds like the sidebar) */
    white?: boolean;
    /** Show a glow/shadow effect */
    glow?: boolean;
}

const HEIGHT_MAP = {
    sm: 40,
    md: 60,
    lg: 80,
    xl: 110,
};

export default function Logo({
    size = 'md',
    linked = true,
    className = '',
    white = false,
    glow = false,
}: LogoProps) {
    const h = HEIGHT_MAP[size];

    const imgStyle: React.CSSProperties = {
        height: h,
        width: 'auto',
        objectFit: 'contain',
        display: 'block',
        filter: white
            ? 'brightness(0) invert(1)'
            : glow
                ? 'drop-shadow(0 0 12px rgba(0,153,255,0.55)) drop-shadow(0 0 6px rgba(233,30,99,0.35))'
                : 'drop-shadow(0 2px 6px rgba(0,0,0,0.12))',
        transition: 'filter 0.3s ease, transform 0.3s ease',
    };

    const inner = (
        <div
            className={`flex items-center select-none group ${className}`}
            style={{ lineHeight: 0 }}
        >
            <img
                src="/logo.png"
                alt="Education Guide"
                style={imgStyle}
                className="group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                }}
            />
            {/* Text fallback — shown only if image fails */}
            <div className="items-baseline hidden">
                <span
                    className="font-extrabold tracking-tight"
                    style={{
                        fontSize: h * 0.45,
                        color: white ? '#fff' : '#0099FF',
                    }}
                >
                    EDUCATION
                </span>
                <span
                    className="font-bold ml-1"
                    style={{
                        fontSize: h * 0.28,
                        color: white ? '#ddd' : '#E91E63',
                    }}
                >
                    GUIDE
                </span>
            </div>
        </div>
    );

    if (!linked) return inner;

    return (
        <Link
            href="/"
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-xl"
            aria-label="Education Guide — Home"
        >
            {inner}
        </Link>
    );
}
