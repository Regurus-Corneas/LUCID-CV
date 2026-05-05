'use server'
import { supabase } from './supabase'
import { currentUser, auth } from '@clerk/nextjs/server'

export async function getCurrentUser() {
  try {
    const authObj = await auth()
    console.log('Auth object:', authObj)
    
    const clerkUser = await currentUser()
    if (!clerkUser) {
      console.log('No Clerk user found')
      return null
    }

    console.log('Clerk user found:', clerkUser.id)

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', clerkUser.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user:', error)
      return null
    }

    if (!user) {
      console.log('Creating new user for:', clerkUser.id)
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          clerk_id: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          first_name: clerkUser.firstName,
          last_name: clerkUser.lastName,
          profile_image_url: clerkUser.imageUrl,
        })
        .select()
        .single()

      if (insertError) {
        console.error('Error creating user:', insertError)
        return null
      }

      console.log('New user created:', newUser)
      return newUser
    }

    console.log('Existing user found:', user)
    return user
  } catch (error) {
    console.error('Error in getCurrentUser:', error)
    return null
  }
}

export async function saveAnalysisResult(
  jobDescription: string,
  resumeText: string,
  analysisResult: any
) {
  try {
    console.log('Attempting to save analysis result...')
    const user = await getCurrentUser()
    if (!user) {
      console.error('User not found when saving analysis')
      throw new Error('User not found')
    }

    console.log('Saving analysis for user:', user.id)
    const { data, error } = await supabase
      .from('analysis_history')
      .insert({
        user_id: user.id,
        job_description: jobDescription,
        resume_text: resumeText,
        analysis_result: analysisResult,
        match_score: analysisResult.matchScore,
        verdict: analysisResult.verdict,
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving analysis:', error)
      throw error
    }

    console.log('Analysis saved successfully:', data)
    return data
  } catch (error) {
    console.error('Error in saveAnalysisResult:', error)
    throw error
  }
}

export async function getAnalysisHistory(limit: number = 10) {
  const user = await getCurrentUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('analysis_history')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching analysis history:', error)
    return []
  }

  return data
}

export async function deleteAnalysisResult(analysisId: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error('User not found')

  const { error } = await supabase
    .from('analysis_history')
    .delete()
    .eq('id', analysisId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting analysis:', error)
    throw error
  }

  return true
}
