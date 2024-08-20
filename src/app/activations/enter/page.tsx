'use client'

import Button from "@/components/Button";
import React from "react";
import Input from "@/components/Input";
import {useRouter} from "next/navigation";

export default function Enter() {
  const [ step, setStep ] = React.useState<number>(0)
  const router = useRouter()
  const questions = [
    {
      id: 'email',
      type: 'email',
      question: 'Qual seu email?',
    },
    {
      id: 'name',
      type: 'text',
      question: 'Qual seu nome completo?',
    },
  ]
  
  const initialValues = questions.reduce((prev, question) => {
    return {
      ...prev,
      [question.id]: '',
    }
  }, {})
  
  const [ formData, setFormData ] = React.useState<object>(initialValues)
  
  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement> ) => {
    const fieldName = event.target.getAttribute('id') as string
    const value = event.target.value
    setFormData({
      ...formData,
      [fieldName]: value
    })
  }
  
  const handleNext = () => {
    setStep((prevStep) => prevStep + 1)
  }
  
  const handleSubmit = () => {
    console.log(formData)
    router.push('/activations')
  }
  
  return (
    <>
      <div className="w-full h-full relative overflow-hidden">
      {questions.map((question, index) => {
        return (
          <div 
            key={question.id} 
            className={`absolute bottom-[40%] left-0 w-full transition-all duration-700 ease-in-out transform ${step === index ? 
              'translate-x-0 opacity-100' : 
              index < step ?
              '-translate-x-full opacity-0 pointer-events-none' :
              'translate-x-full opacity-0 pointer-events-none'
            }`}
          >
            <Input
              label={question.question}
              id={question.id}
              onChange={handleChangeInput}
              value={formData[question.id]}
              type={question.type}
            />
          </div>
        )
      })}
      </div>
      {step < (questions.length - 1) ? (
        <Button text="Próximo" onClick={handleNext} type="button" />
        ) : (
        <Button text="Começar" onClick={handleSubmit} type="button"/>  
      )}

    </>
  )
}