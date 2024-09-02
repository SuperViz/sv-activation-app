import { ActivationTypePage } from "@/global/global.types";
import ActivationLayout from "./ActivationLayout";

export default function NewsletterActivation({ setPage }: { setPage: (page: ActivationTypePage) => void }) {
  return (
    <ActivationLayout setPage={setPage}>
      <div className={`bg-[#313338] w-full h-full rounded-2xl p-4`}>
        <iframe
          src='https://47xzvrbdgjk.typeform.com/to/eGJ6c0Ah'
          width="100%"
          height="100%"
          allowFullScreen
          sandbox='allow-scripts allow-same-origin allow-forms'
        >
        </iframe>
      </div>
    </ActivationLayout>
    
  )
}