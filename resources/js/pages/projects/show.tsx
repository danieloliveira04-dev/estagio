import ProjectLayout from '@/layouts/project/project-layout';
import projects from '@/routes/projects';
import { BreadcrumbItem } from '@/types';

// interface ProjectShowProps {
//     project: Project;
//     flash?: FlashType;
//     app: SharedData;
// };

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Projetos",
        href: projects.list().url,
    },
    {
        title: '',
        href: '',
    }
];

export default function ProjectShow() {
    return <ProjectLayout tab="preview" breadcrumbs={breadcrumbs}></ProjectLayout>
}
