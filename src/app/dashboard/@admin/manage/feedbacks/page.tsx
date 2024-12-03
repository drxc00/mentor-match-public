import Feedback from '@/models/feedback.model';
import AdditionalFeedback from '@/models/additionalFeedback.model';
import connect from '@/utils/db.config';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from 'next/link';
import { DataTable } from './components/data-table';
import { columns} from './components/columns';
import { columns as AdditionalFeedbackColumns } from './components/additional-feed-colums';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FeedbacksTab from './components/feedbacks-tabs';



const getFeedbacks = async () => {
    "use server"
    await connect();
    const feedbacks = await Feedback.aggregate(
        [
            {
                $lookup: {
                    from: "users",
                    localField: "reviewer",
                    foreignField: "_id",
                    as: "reviewer"
                }
            },
            {
                $unwind: "$reviewer"
            },
            {
                $lookup: {
                    from: "users",
                    localField: "reviewee",
                    foreignField: "_id",
                    as: "reviewee"
                }
            },
            {
                $unwind: "$reviewee"
            },
            { $sort: { createdAt: 1 } },
        ]
    );

    const additional_feedbacks = await AdditionalFeedback.aggregate(
        [
            {
                $lookup: {
                    from: "users",
                    localField: "reviewer",
                    foreignField: "_id",
                    as: "reviewer"
                }
            },
            {
                $unwind: "$reviewer"
            },
            {
                $lookup: {
                    from: "users",
                    localField: "reviewee",
                    foreignField: "_id",
                    as: "reviewee"
                }
            },
            {
                $unwind: "$reviewee"
            }
        ]
    )
    return {
        feedbacks,
        additional_feedbacks,
    };
}

export default async function FeedbacksPage() {

    const data__parse = await getFeedbacks();
    const data = JSON.parse(JSON.stringify(data__parse));

    const feedbacks: any[] = data.feedbacks;

    const additional_feedbacks: any[] = data.additional_feedbacks;


    return (
        <div className="w-full p-5">
            <div className="flex space-y-2 p-2 md:p-1 pt-6">
                <div className=" flex flex-col py-2 w-full p-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <Breadcrumb className="py-2">
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink asChild>
                                            <Link href="/dashboard">Dashboard</Link>
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbLink asChild>
                                            <Link href="/dashboard/manage/feedbacks">Feedbacks</Link>
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>All Feedbacks</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                            <h2 className="text-4xl font-bold tracking-tight text-maroon">Feedbacks</h2>
                            <p className="text-md text-extrabold text-black mt-2">View all session feedbacks</p>
                        </div>
                    </div>
                    <div className='mt-5'>
                        <FeedbacksTab feedbacks={feedbacks} additional_feedbacks={additional_feedbacks} />
                    </div>
                </div>
            </div>
        </div>
    )
}