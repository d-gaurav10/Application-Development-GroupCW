import { HiBolt, HiShieldCheck, HiStar } from "react-icons/hi2";
import { FaRegThumbsUp } from "react-icons/fa";

const features = [
  { icon: <HiBolt className="text-purple-600" />, title: "Quick Delivery" },
  { icon: <HiShieldCheck className="text-purple-600" />, title: "Secure Payment" },
  { icon: <FaRegThumbsUp className="text-purple-600" />, title: "Best Quality" },
  { icon: <HiStar className="text-purple-600" />, title: "Return Guarantee" },
];

export default function Features() {
  return (
    <div className="flex flex-wrap justify-center gap-8 py-10">
      {features.map((f, idx) => (
        <div key={idx} className="flex flex-col items-center max-w-xs text-center">
          <div className="text-3xl mb-2">{f.icon}</div>
          <h4 className="font-bold">{f.title}</h4>
          <p className="text-sm text-gray-500">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>
      ))}
    </div>
  );
}
