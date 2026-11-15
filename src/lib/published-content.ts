const demoTestimonials = new Set([
  'sarah johnson|techstart inc.',
  'michael chen|growthhub',
  'emily rodriguez|retailmax',
])

const demoMetrics = new Set([
  'projects completed|150+',
  'happy clients|100+',
  'team members|25+',
  'years experience|8+',
])

const demoTeamMembers = new Set(['alex thompson', 'sarah williams', 'david park', 'maria garcia'])

export function isDemoTestimonial(name: string, company: string | null): boolean {
  return demoTestimonials.has(`${name.trim().toLowerCase()}|${(company || '').trim().toLowerCase()}`)
}

export function isDemoMetric(label: string, value: string): boolean {
  return demoMetrics.has(`${label.trim().toLowerCase()}|${value.trim().toLowerCase()}`)
}

export function isDemoTeamMember(name: string): boolean {
  return demoTeamMembers.has(name.trim().toLowerCase())
}

export function isPlaceholderBlogContent(content: string | null | undefined): boolean {
  return Boolean(content && /<p>[^<]*(?:\.\.\.|…)[^<]*<\/p>\s*$/i.test(content))
}
