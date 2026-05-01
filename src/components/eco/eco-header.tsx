import { MailCheck, PhoneCall } from "lucide-react"
import Image from "next/image"
import "./customize.css"

export const EcoHeader =() => {
    // Temp for localhost
    const logo_url = "https://radiant-actor-d06328652d.media.strapiapp.com/LOGO_DAO_XANH_PNG_77733dcbcc.png"

    return (
        <header>
                <div className="h-6 w-full bg-amber-200 flex xl:flex-row flex-col xl:mb-0 mb-10 text-black justify-around">
                    <div className="flex gap-2 text-amber-900 justify-center">
                        <MailCheck className="shake-slow"/>
                        <p>daoxanhecofarmdaklak@gmail.com</p>
                    </div>
                    <p className="text-orange-500 flex justify-center">
                        Hãy cùng Đảo Xanh với chúng tôi nhé!
                    </p>
                    <div className="flex gap-2 bg-amber-200 text-amber-900 justify-center">
                        <PhoneCall className="shake-slow"/>
                        <p>096 189 89 72 - 098 714 14 14 </p>
                    </div>
                </div>
                <div className="flex justify-center p-4">
                    <Image src={logo_url} width="200" height="200" alt="Ecofarm Logo" unoptimized/>
                </div>
            </header>
    )
}