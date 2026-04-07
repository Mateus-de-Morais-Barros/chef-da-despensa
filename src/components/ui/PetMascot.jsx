import petFeliz from './pet feliz.png'
import petBuscandoReceita from './pet buscando receita.png'
import petOlhandoGeladeira from './pet olhando pra geladeira.png'

const pets = {
  feliz: petFeliz,
  buscandoReceita: petBuscandoReceita,
  olhandoGeladeira: petOlhandoGeladeira,
}

export default function PetMascot({ mood = 'feliz', size = 120 }) {
  return (
    <img
      src={pets[mood]}
      alt="mascote"
      width={size}
      height={size}
      style={{ objectFit: 'contain' }}
    />
  )
}
