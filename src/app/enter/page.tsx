'use client'

import React from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import {createUser} from "@/app/services/createUser";
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
      question: 'Como gostaria de ser chamado(a)?',
    },
  ]
  
  const initialValues = questions.reduce((prev, question) => {
    return {
      ...prev,
      [question.id]: '',
    }
  }, {})
  
  const [ formData, setFormData ] = React.useState<Record<string, string>>(initialValues)
  const [ validField, setValidField ] = React.useState<boolean>(false)
  
  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement> ) => {
    const fieldName = event.target.getAttribute('id') as string
    const fieldValidity = event.target.validity.valid
    const value = event.target.value
    setFormData({
      ...formData,
      [fieldName]: value
    })
    if(fieldValidity !== validField) {
      setValidField(fieldValidity)
    }
  }
  
  const handleNext = () => {
    setStep((prevStep) => prevStep + 1)
    setValidField(false)
  }
  
  const handleSubmit = async () => {
    await createUser(formData)
      .catch((error) => {
        console.error('Erro interno', error)
      })
    
    router.push('/userPage')
  }
  
  return (
    <form className="w-full h-full relative overflow-hidden flex flex-col justify-end">
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
      {step < (questions.length - 1) ? (
        <Button text="Próximo" onClick={handleNext} type="button" disabled={!validField}/>
        ) : (
        <Button text="Começar" onClick={handleSubmit} type="button" disabled={!validField} />  
      )}
    </form>
  )
}