export default function DiscordEmbededPage() {
  return (
    <div className={`bg-[#313338] w-full h-full rounded-2xl p-4`}>
      <iframe
        src='https://discord.com/invite/Zb2arax9nn'
        width="100%"
        height="100%"
        allowFullScreen
        sandbox={``}
      >
        <p>
          <a href="https://superviz.com/">
            Oops... algo deu errado!
          </a>
        </p>
      </iframe>
    </div>
  )
}