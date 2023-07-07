'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import Form from '@components/Form'
import { useSession } from 'next-auth/react'

const EditPrompt = () => {
    const router = useRouter()
    const {data : session} = useSession()

    const searchParams = useSearchParams()
    const promptId = searchParams.get('id')
    const [submitting, setsubmitting] = useState(false)
    const [post, setpost] = useState({
        prompt: '',
        tag: '',
    })
    const updatePrompt = async (e) =>{
        e.preventDefault()
        setsubmitting(true)

        if(!promptId) return alert("Prompt Id not found")

        try{
            const response = await fetch(`/api/prompt/${promptId}`,
            {
                method : 'PATCH',
                body: JSON.stringify({
                    prompt: post?.prompt,
                    userId:session?.user?.id,
                    tag:post.tag
                })
            })
            if(response.ok){
                router.push('/')
            }
        }catch(error){
            console.log(error)
        }finally{
            setsubmitting(false)
        }
    }

    useEffect(() => {
        const getPromptDetails = async () => {
            const response = await fetch(`/api/prompt/${promptId}`)

            console.log(response,'response')

            const data = await response.json()

            setpost({
                prompt: data.prompt,
                tag: data.tag
            })
        }

        if (promptId) getPromptDetails()
    }, [promptId])

    
    return (
        <Form
            type="Edit"
            post={post}
            setpost={setpost}
            submitting={submitting}
            handleSubmit={updatePrompt} />
    )
}

export default EditPrompt