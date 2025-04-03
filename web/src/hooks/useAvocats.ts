import { useState } from "react";

type Avocat = {
    id: number;
    nom: string;
    prenom: string;
    password: string;
    email: string;
    linkedin: string;
    image: string;
    selected: boolean;
};

const initialAvocats: Avocat[] = [
    { id: 1, nom: "Doe", prenom: "John", password: "12345678", email: "john@example.com", linkedin: "https://linkedin.com/in/johndoe", image: "/images/avocatImg-2.png", selected: false },
    { id: 2, nom: "Smith", prenom: "Jane", password: "12345678", email: "jane@example.com", linkedin: "https://linkedin.com/in/janesmith", image: "/images/avocatImg.png", selected: false },
    { id: 3, nom: "Smith", prenom: "Jane", password: "12345678", email: "jane@example.com", linkedin: "https://linkedin.com/in/janesmith", image: "/images/avocatImg-2.png", selected: false },
    { id: 4, nom: "Smith", prenom: "Jane", password: "12345678", email: "jane@example.com", linkedin: "https://linkedin.com/in/janesmith", image: "/images/avocatImg.png", selected: false },
    { id: 5, nom: "Smith", prenom: "Jane", password: "12345678", email: "jane@example.com", linkedin: "https://linkedin.com/in/janesmith", image: "/images/avocatImg-2.png", selected: false },
    { id: 6, nom: "Smith", prenom: "Jane", password: "12345678", email: "jane@example.com", linkedin: "https://linkedin.com/in/janesmith", image: "/images/avocatImg.png", selected: false },
    { id: 7, nom: "Smith", prenom: "Jane", password: "12345678", email: "jane@example.com", linkedin: "https://linkedin.com/in/janesmith", image: "/images/avocatImg-2.png", selected: false },
    { id: 8, nom: "Smith", prenom: "Jane", password: "12345678", email: "jane@example.com", linkedin: "https://linkedin.com/in/janesmith", image: "/images/avocatImg-2.png", selected: false },
];

export const useAvocats = () => {
    const [avocats, setAvocats] = useState<Avocat[]>(initialAvocats);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [formData, setFormData] = useState<Omit<Avocat, 'id' | 'selected'>>({
        nom: '',
        prenom: '',
        password: '',
        email: '',
        linkedin: '',
        image: '/images/avocatImg.png'
    });
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);

    const selectedAvocats = avocats.filter(avocat => avocat.selected);

    const toggleSelect = (id: number) => {
        setAvocats(prev =>
            prev.map(avocat =>
                avocat.id === id ? { ...avocat, selected: !avocat.selected } : avocat
            )
        );
    };

    const toggleSelectAll = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        setAvocats(prev => prev.map(avocat => ({ ...avocat, selected: newSelectAll })));
    };

    const deleteAvocats = () => {
        setAvocats(prev => prev.filter(avocat => !avocat.selected));
        setSelectAll(false);
    };

    const addAvocat = (e: React.FormEvent, onSuccess?: () => void) => {
        e.preventDefault();
        
        const newAvocat: Avocat = {
            id: avocats.length > 0 ? Math.max(...avocats.map(a => a.id)) + 1 : 1,
            ...formData,
            image: uploadedImage || '/images/avocatImg.png',
            selected: false
        };
    
        setAvocats(prev => [...prev, newAvocat]);
        resetForm();
        onSuccess?.(); // Call the success callback if provided
    };

    const resetForm = () => {
        setFormData({
            nom: '',
            prenom: '',
            password: '',
            email: '',
            linkedin: '',
            image: '/images/avocatImg.png'
        });
        setUploadedImage(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (imageUrl: string) => {
        setUploadedImage(imageUrl);
    };

    return {
        avocats,
        selectAll,
        formData,
        selectedAvocats,
        toggleSelect,
        toggleSelectAll,
        deleteAvocats,
        addAvocat,
        handleInputChange,
        handleImageUpload,
        resetForm
    };
};