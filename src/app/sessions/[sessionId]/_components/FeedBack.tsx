
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";


interface feedback {
    _id: string,
    rating: number,
    reviewer: string,
    reviewee: string,
    feedback: string
}

export default function Feedback({ feedback }: { feedback: feedback }) {

    const filledStars = Array.from({ length: feedback.rating }, (_, index) => index)
    const unFilledStars = Array.from({ length: (5 - feedback.rating) }, (_, index) => index)
    return (
        <div>
            <div className="bg-white rounded-xl border overflow-hidden">
                <div className="p-4">
                    <h2 className="text-base font-semibold text-gray-800 mb-2">Your Feedback</h2>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gold-900">
                            <div className="flex gap-1">
                                {filledStars.map(index => (
                                    <StarFilledIcon key={index} />
                                ))}

                                {unFilledStars.map(index => (
                                    <StarIcon key={index} />
                                ))}
                            </div>
                        </span>
                    </div>
                    <p className="text-sm text-gray-700">{feedback.feedback}</p>
                </div>
            </div>
        </div>
    );
}