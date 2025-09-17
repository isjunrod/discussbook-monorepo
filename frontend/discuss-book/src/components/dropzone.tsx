'use client';

import { useDropzone } from 'react-dropzone';
import SVG from './svg';

function DropZone(props: any) {
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        accept: {
            'application/pdf': [],  // Usar solo el tipo MIME como clave
        },
        onDrop: (acceptedFiles) => {
            props.setFiles(acceptedFiles);
        },
    });

    const handleClearFiles = () => {
        props.setFiles([]);
    };

    const acceptedFileItems = acceptedFiles.map((file) => (
        <h5 key={file.path} className="text-[1.4rem]">
            {file.path
                ? file.path.length > 50
                    ? file.path.slice(2).slice(0, 50) + '...'
                    : file.path
                : 'Nombre no disponible'}{' '}
            - {(file.size / 1048576).toFixed(2)} MB
        </h5>
    ));

    return (
        <>
            <section
                className={`${
                    props.files.length > 0 ? 'bg-neutral-800' : 'bg-transparent'
                } font-testSohneBuch border border-neutral-800 relative py-8 px-16 rounded-[0.5rem] min-w-[50rem]`}
            >
                {props.files.length > 0 ? (
                    <div className="flex flex-row justify-between gap-12 text-center items-center">
                        {acceptedFileItems}
                        <div
                            className="relative w-[1.2rem] h-[1.2rem] cursor-pointer"
                            onClick={handleClearFiles}
                        >
                            <SVG color="var(--neutral50)" type="delete" />
                        </div>
                    </div>
                ) : (
                    <div {...getRootProps({ className: 'dropzone' })}>
                        <input {...getInputProps()} />
                        <div className="flex flex-col text-center text-[1.4rem]">
                            <p className="text-[1.4rem]">
                                Drag and drop or Click to choose a file
                            </p>
                            <em className="text-[1.4rem]">(Only *.pdf)</em>
                        </div>
                    </div>
                )}
            </section>
        </>
    );
}

export default DropZone;
