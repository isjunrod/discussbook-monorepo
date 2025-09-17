export interface SVGProps {
    color: string;
    type: 'search' | 'x' | 'navbar' | 'delete' | 'rowRight' | 'painting';
}

const typeSVG = {
    search: (color: string) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 28 32"
            height='100%'
            width='100%'
        >
            <path
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M18.602 18.591 27 27m-5.556-15.278c0 5.37-4.352 9.722-9.722 9.722-5.37 0-9.722-4.352-9.722-9.722C2 6.352 6.353 2 11.722 2c5.37 0 9.722 4.353 9.722 9.722Z"
            />
        </svg>
    ),
    x: (color: string) => (
        <svg xmlns="http://www.w3.org/2000/svg" height='100%' width='100%' viewBox="0 0 26 23" fill="none">
            <path d="M20.4765 0H24.4631L15.7533 9.74272L26 23H17.9767L11.6929 14.9593L4.50272 23H0.513348L9.82942 12.5793L0 0H8.22651L13.9067 7.34928L20.4765 0ZM19.0771 20.6645H21.2864L7.02625 2.21289H4.65578L19.0771 20.6645Z" fill={color} />
        </svg>
    ),
    navbar: (color: string) => (
        <svg height='100%' width='100%' viewBox="0 0 26 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.3125 0.6875H2.6875C2.19022 0.6875 1.71331 0.885044 1.36167 1.23667C1.01004 1.58831 0.8125 2.06522 0.8125 2.5625V19.4375C0.8125 19.9348 1.01004 20.4117 1.36167 20.7633C1.71331 21.115 2.19022 21.3125 2.6875 21.3125H23.3125C23.8098 21.3125 24.2867 21.115 24.6383 20.7633C24.99 20.4117 25.1875 19.9348 25.1875 19.4375V2.5625C25.1875 2.06522 24.99 1.58831 24.6383 1.23667C24.2867 0.885044 23.8098 0.6875 23.3125 0.6875ZM2.6875 2.5625H7.375V19.4375H2.6875V2.5625ZM23.3125 19.4375H9.25V2.5625H23.3125V19.4375Z" fill={color} />
        </svg>
    ),
    delete: (color: string) => (
        <svg width="100%" height="100%" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M10.8536 0.853553C11.0488 0.658291 11.0488 0.341709 10.8536 0.146447C10.6583 -0.0488155 10.3417 -0.0488155 10.1464 0.146447L5.5 4.79289L0.853553 0.146447C0.658291 -0.0488155 0.341709 -0.0488155 0.146447 0.146447C-0.0488155 0.341709 -0.0488155 0.658291 0.146447 0.853553L4.79289 5.5L0.146447 10.1464C-0.0488155 10.3417 -0.0488155 10.6583 0.146447 10.8536C0.341709 11.0488 0.658291 11.0488 0.853553 10.8536L5.5 6.20711L10.1464 10.8536C10.3417 11.0488 10.6583 11.0488 10.8536 10.8536C11.0488 10.6583 11.0488 10.3417 10.8536 10.1464L6.20711 5.5L10.8536 0.853553Z" fill={color} />
        </svg>
    ),
    rowRight: (color: string) => (
        <svg width="100%" height="100%" viewBox="0 0 63 128" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M0.790169 0.676127C1.79745 -0.268199 3.37954 -0.217163 4.32386 0.790118L61.8716 62.1744C62.7732 63.1361 62.7732 64.6325 61.8716 65.5941L4.32385 126.978C3.37953 127.986 1.79744 128.037 0.790155 127.092C-0.217125 126.148 -0.268161 124.566 0.676165 123.559L56.6209 63.8843L0.676178 4.20982C-0.268147 3.20254 -0.217112 1.62045 0.790169 0.676127Z" fill={color} />
        </svg>
    ),
    painting: (color: string) => (
        <svg width="100%" height="100%" viewBox="0 0 458 347" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="mask0_52_117" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="-34" width="457" height="381">
                <rect x="229.5" y="-33.5" width="152" height="152" rx="9.5" stroke="#7D7D7D" />
                <rect x="304.5" y="42.5" width="152" height="152" rx="9.5" stroke="#7D7D7D" />
                <rect x="77.5" y="-33.5" width="152" height="152" rx="9.5" stroke="#7D7D7D" />
                <rect x="152.5" y="42.5" width="152" height="152" rx="9.5" stroke="#7D7D7D" />
                <rect x="0.5" y="118.5" width="152" height="152" rx="9.5" stroke="#7D7D7D" />
                <rect x="76.5" y="194.5" width="152" height="152" rx="9.5" stroke="#7D7D7D" />
            </mask>
            <g mask="url(#mask0_52_117)">
                <rect y="-34" width="458" height="381" fill="url(#paint0_linear_52_117)" />
            </g>
            <defs>
                <linearGradient id="paint0_linear_52_117" x1="0" y1="-34" x2="458" y2="347" gradientUnits="userSpaceOnUse">
                    <stop offset="0.228015" stopColor="#171717" />
                    <stop offset="0.427169" stopColor="#494949" />
                    <stop offset="0.572093" stopColor="#969696" />
                    <stop offset="1" stopColor="#D9D9D9" />
                </linearGradient>
            </defs>
        </svg>
    )
}

const SVG = ({ color, type }: SVGProps) => (
    <>
        {typeSVG[type](color)}
    </>
)
export default SVG