import { notFound } from 'next/navigation';
import { getProject, getProjects } from '@/lib/api';
import { ProjectDetail } from '@/components/projects/ProjectDetail';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const project = await getProject(slug);
    return {
      title: project.title,
      description: project.description,
      openGraph: {
        title: project.title,
        description: project.description,
        type: 'article',
        images: project.imageUrl ? [project.imageUrl] : [],
      },
    };
  } catch {
    return {
      title: 'Project Not Found',
    };
  }
}

export async function generateStaticParams() {
  try {
    const projects = await getProjects();
    return projects.map((project) => ({
      slug: project.slug,
    }));
  } catch {
    return [];
  }
}

export const revalidate = 60;

export default async function ProjectPage({ params }: Props) {
  try {
    const { slug } = await params;
    const project = await getProject(slug);

    return <ProjectDetail project={project} />;
  } catch {
    notFound();
  }
}
