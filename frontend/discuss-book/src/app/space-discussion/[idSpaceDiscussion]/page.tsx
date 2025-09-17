import InputComments from "@/src/components/inputComment";
import CommentsViwer from '../../../components/commentsViwer'
import PDFViwer from "../../../components/viewerPDF";

export default async function HubDiscussion({children, params}: {children: React.ReactNode, params: Promise<{ idSpaceDiscussion: string }>}) {

    const { idSpaceDiscussion } = await params;

    return (
        <div id="archive" className="h-[100vh] w-[160rem] self-center overflow-hidden flex flex-col">
            <h1 id="archive-title" className="font-testSohneBuch text-[2rem]">wdwd</h1>

            <div id="archive-container-source-comments" className="h-full w-full flex flex-row gap-10">
                <div id="archive-container-source" className="w-full h-full bg-neutral-900 rounded-[1rem] overflow-hidden">
                    <PDFViwer idSpaceDiscussion={idSpaceDiscussion}/>
                </div>

                <div id="archive-container-comments" className="h-full w-[90rem] flex flex-col gap-[2rem] rounded-[1rem] pb-[7rem] p-[2rem] overflow-y-auto overflow-x-hidden bg-neutral-900">
                    <CommentsViwer />
                    <InputComments />
                </div>
            </div>
        </div>
    )
}