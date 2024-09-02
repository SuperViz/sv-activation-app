'use client'

import { useState } from 'react'
import './onboarding.scss'
import Button from '@/components/Button'
import Image from 'next/image'

export default function GameOnboarding() {
	const [currentStep, setCurrentStep] = useState(0)

	const moveToGame = () => {
		window.open('/activations/game/play', '_self')
	}

	const moveNext = () => {
		if (localStorage.getItem('onboarding-finished'))
			moveToGame()
		else
			setCurrentStep(currentStep + 1)

		if (currentStep === 2)
			localStorage.setItem('onboarding-finished', 'true')
	}

	return (
		<div className='onboarding'>
			{currentStep === 0 && (
				<div className='step'>
					<div className='game-title'>
						<h1>Super<span>{'<Craft>'}</span></h1>
						<p>Combine e crie elementos</p>
						<p>🔥 💧 🍃 🌎</p>
					</div>

					<Button text={'Jogar'} type={'button'} onClick={moveNext} />
				</div>
			)}

			{currentStep === 1 && (
				<div className='step'>
					<div className='step-counter'>
						<div className='step-circle active'></div>
						<div className='step-circle'></div>
						<div className='step-circle'></div>
					</div>

					<div className='step-description'>
						<h2>Como jogar</h2>
						<p>Todos os jogadores começam com elementos básicos como Água, Vento, Terra e Fogo. Arraste os elementos e os combine para criar novos.</p>
					</div>

					<Button text={'Próximo'} type={'button'} onClick={moveNext} />
				</div>
			)}

			{currentStep === 2 && (
				<div className='step'>
					<div className='step-counter'>
						<div className='step-circle active'></div>
						<div className='step-circle active'></div>
						<div className='step-circle'></div>
					</div>

					<div className='step-description'>
						<h2>Como jogar</h2>
						<p>Ao descobrir elementos inéditos que nenhum jogador jamais encontrou, ganhe +1 ponto para concorrer ao prêmio!</p>
					</div>

					<Button text={'Próximo'} type={'button'} onClick={moveNext} />
				</div>
			)}

			{currentStep === 3 && (
				<div className='step'>
					<div className='step-counter'>
						<div className='step-circle active'></div>
						<div className='step-circle active'></div>
						<div className='step-circle active'></div>
					</div>

					<div className='step-description'>
						<h2>Como jogar</h2>
						<p>Você pode conseguir até 10 pontos e aumentar suas chances de levar o prêmio!</p>
					</div>

					<Image src={'/game-you.png'} alt={'Você'} width={101} height={141} />

					<Button text={'Próximo'} type={'button'} onClick={moveToGame} />
				</div>
			)}
		</div>
	)
}