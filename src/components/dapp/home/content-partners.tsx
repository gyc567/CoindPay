interface ContentPartnersProps {
  customClass?: string
}

export default function ContentPartners({ customClass = '' }: ContentPartnersProps) {
  return (
    <section className={`w-full py-16 px-4 ${customClass}`}>
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8">Our Partners</h2>
        <p className="text-gray-600">Trusted by leading web3 projects</p>
      </div>
    </section>
  )
}
