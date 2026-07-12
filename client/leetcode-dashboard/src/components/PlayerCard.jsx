import { useState } from "react";

const STAT_LABELS = {
    PAC: "Pace",
    SHO: "Shooting",
    PAS: "Passing",
    DRI: "Dribbling",
    DEF: "Defending",
    PHY: "Physical",
};

// Rarity tiers, exactly like FUT: the card's whole visual language
// (color, foil, glow) is driven by the overall rating, not chosen by hand.
const TIERS = [
    {
        min: 93,
        name: "Icon",
        bg: "linear-gradient(160deg, #f7e7c4 0%, #eec98a 38%, #d99a5b 68%, #b9793f 100%)",
        edge: "#8a5a2a",
        ink: "#3d2408",
        sub: "rgba(61,36,8,0.72)",
        ray: "rgba(255,255,255,0.55)",
        foil: true,
    },
    {
        min: 85,
        name: "Team of the Week",
        bg: "linear-gradient(160deg, #3a1466 0%, #23093f 45%, #120522 100%)",
        edge: "#9b3fd1",
        ink: "#f3e8ff",
        sub: "rgba(243,232,255,0.65)",
        ray: "rgba(178,102,255,0.35)",
        foil: true,
    },
    {
        min: 75,
        name: "Gold",
        bg: "linear-gradient(160deg, #ffe083 0%, #f0b32e 45%, #c47f0a 100%)",
        edge: "#8a5c07",
        ink: "#3a2400",
        sub: "rgba(58,36,0,0.68)",
        ray: "rgba(255,255,255,0.45)",
        foil: false,
    },
    {
        min: 65,
        name: "Silver",
        bg: "linear-gradient(160deg, #eef2f4 0%, #c6d0d6 45%, #93a1a9 100%)",
        edge: "#5c6a70",
        ink: "#1c2b30",
        sub: "rgba(28,43,48,0.65)",
        ray: "rgba(255,255,255,0.5)",
        foil: false,
    },
    {
        min: 0,
        name: "Bronze",
        bg: "linear-gradient(160deg, #d3a06c 0%, #a5652f 45%, #6e3e18 100%)",
        edge: "#4a2a10",
        ink: "#2c1503",
        sub: "rgba(44,21,3,0.68)",
        ray: "rgba(255,224,180,0.4)",
        foil: false,
    },
];

function tierFor(overall) {
    return TIERS.find((t) => overall >= t.min) ?? TIERS[TIERS.length - 1];
}

const DEMO_CARD = {
    username: "sami_kade",
    avatar: "https://i.pravatar.cc/300?img=13",
    overall: 91,
    archetype: "Playmaker",
    stats: { PAC: 88, SHO: 79, PAS: 93, DRI: 90, DEF: 55, PHY: 74 },
    headline: {
        totalSolved: 1284,
        rating: 2143,
        activeDaysLast90: 61,
        globalRanking: 312,
    },
};

export function PlayerCard({ card = DEMO_CARD }) {
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    if (!card) return null;
    const { username, avatar, overall, archetype, stats, headline } = card;
    const tier = tierFor(overall);

    function handleMove(e) {
        const r = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        setTilt({ x: py * -10, y: px * 14 });
    }
    function handleLeave() {
        setTilt({ x: 0, y: 0 });
    }

    return (
        <div
            className="max-w-sm mx-auto"
            style={{ perspective: "1200px" }}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
        >
            <div
                className="relative overflow-hidden transition-transform duration-150 ease-out"
                style={{
                    background: tier.bg,
                    clipPath:
                        "polygon(10% 0%, 90% 0%, 100% 9%, 100% 78%, 50% 100%, 0% 78%, 0% 9%)",
                    padding: "34px 26px 46px",
                    boxShadow: `0 18px 40px -12px ${tier.edge}88`,
                    transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                    transformStyle: "preserve-3d",
                }}
            >
                {/* Sunburst behind the avatar */}
                <div
                    className="absolute rounded-full pointer-events-none"
                    style={{
                        top: "-40px",
                        right: "-60px",
                        width: "260px",
                        height: "260px",
                        background: `repeating-conic-gradient(${tier.ray} 0deg 4deg, transparent 4deg 12deg)`,
                        opacity: tier.foil ? 0.7 : 0.45,
                    }}
                />
                {/* Diagonal foil sweep, stronger on rare tiers */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.28) 48%, transparent 62%)",
                        opacity: tier.foil ? 1 : 0.5,
                    }}
                />

                {/* Header: rating badge + position + avatar */}
                <div className="relative flex items-start justify-between">
                    <div>
                        <p
                            className="text-6xl font-black leading-none tracking-tight"
                            style={{ color: tier.ink }}
                        >
                            {overall}
                        </p>
                        <p
                            className="text-[11px] font-bold uppercase tracking-[0.2em] mt-1"
                            style={{ color: tier.sub }}
                        >
                            {tier.name}
                        </p>
                        <div
                            className="mt-2 inline-block text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                            style={{
                                color: tier.ink,
                                border: `1px solid ${tier.edge}`,
                                background: "rgba(255,255,255,0.18)",
                            }}
                        >
                            {archetype}
                        </div>
                    </div>
                    <img
                        src={avatar}
                        alt={username}
                        className="w-24 h-24 rounded-full object-cover"
                        style={{
                            border: `3px solid ${tier.edge}`,
                            boxShadow: "0 6px 14px rgba(0,0,0,0.35)",
                        }}
                    />
                </div>

                {/* Name banner */}
                <div className="relative text-center mt-3">
                    <h2
                        className="text-2xl font-black uppercase tracking-tight"
                        style={{ color: tier.ink }}
                    >
                        {username}
                    </h2>
                    <div
                        className="mx-auto mt-2 h-[2px] w-16"
                        style={{ background: tier.edge }}
                    />
                </div>

                {/* Stats: two columns split by a divider, FUT-style */}
                <div
                    className="relative grid mt-5"
                    style={{ gridTemplateColumns: "1fr 1px 1fr", columnGap: "20px" }}
                >
                    <div className="flex flex-col gap-2.5">
                        {Object.entries(stats).slice(0, 3).map(([key, value]) => (
                            <StatRow key={key} k={key} v={value} tier={tier} />
                        ))}
                    </div>
                    <div style={{ background: `${tier.edge}55` }} />
                    <div className="flex flex-col gap-2.5">
                        {Object.entries(stats).slice(3).map(([key, value]) => (
                            <StatRow key={key} k={key} v={value} tier={tier} />
                        ))}
                    </div>
                </div>

                {/* Footer headline */}
                <div
                    className="relative flex justify-center gap-4 flex-wrap mt-6 pt-3"
                    style={{
                        borderTop: `1px solid ${tier.edge}55`,
                    }}
                >
                    <FootStat label="solved" value={headline.totalSolved} tier={tier} />
                    {headline.rating != null && (
                        <FootStat label="rating" value={Math.round(headline.rating)} tier={tier} />
                    )}
                    <FootStat label="active (90d)" value={headline.activeDaysLast90} tier={tier} />
                    {headline.globalRanking && (
                        <FootStat label="rank" value={`#${headline.globalRanking}`} tier={tier} />
                    )}
                </div>
            </div>
        </div>
    );
}

function StatRow({ k, v, tier }) {
    return (
        <div className="flex items-center gap-2.5">
            <span
                className="text-lg font-black w-7 text-right tabular-nums"
                style={{ color: tier.ink }}
            >
                {v}
            </span>
            <div>
                <p
                    className="text-xs font-bold leading-none tracking-wide"
                    style={{ color: tier.ink }}
                >
                    {k}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: tier.sub }}>
                    {STAT_LABELS[k]}
                </p>
            </div>
        </div>
    );
}

function FootStat({ label, value, tier }) {
    return (
        <div className="flex flex-col items-center">
            <span className="text-sm font-black tabular-nums" style={{ color: tier.ink }}>
                {value}
            </span>
            <span
                className="text-[9px] uppercase tracking-wider"
                style={{ color: tier.sub }}
            >
                {label}
            </span>
        </div>
    );
}

export default PlayerCard;