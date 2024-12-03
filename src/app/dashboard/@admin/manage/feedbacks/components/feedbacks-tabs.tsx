'use client';

import { DataTable } from './data-table';
import { columns } from './columns';
import { columns as AdditionalFeedbackColumns } from './additional-feed-colums';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

export default function FeedbacksTab({ feedbacks, additional_feedbacks }: any) {

    const router = useRouter();
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab')

    const onClick = (tab: string) => {
        const url = new URL(window.location.href);
        url.searchParams.set('tab', tab)

        router.push(url.toString());
    }
    return (
        <Tabs defaultValue={tab ? tab : "feedbacks"}>
            <TabsList className='bg-gold-500'>
                <TabsTrigger value="feedbacks" onClick={() => onClick("feedbacks")}>
                    Feedbacks
                </TabsTrigger>
                <TabsTrigger value="additionalFeedbacks" onClick={() => onClick("additionalFeedbacks")}>
                    Additional Feedbacks
                </TabsTrigger>
            </TabsList>
            <TabsContent value="feedbacks">
                <DataTable columns={columns} data={feedbacks} />
            </TabsContent>
            <TabsContent value="additionalFeedbacks">
                <DataTable columns={AdditionalFeedbackColumns} data={additional_feedbacks} />
            </TabsContent>
        </Tabs>
    )
}