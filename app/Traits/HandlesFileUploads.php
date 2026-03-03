<?php

namespace App\Traits;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

trait HandlesFileUploads
{
    /**
     * Upload a file and return the stored path.
     */
    protected function uploadFile(Request $request, string $directory, string $disk = 'public'): ?string
    {
        if (! $request->hasFile('file')) {
            return null;
        }

        $file = $request->file('file');

        return $file->store($directory, $disk);
    }

    /**
     * Upload multiple files and return array of file info.
     */
    protected function uploadMultipleFiles(Request $request, string $fieldName, string $directory, string $disk = 'public'): array
    {
        $uploadedFiles = [];

        if (! $request->hasFile($fieldName)) {
            return $uploadedFiles;
        }

        foreach ($request->file($fieldName) as $file) {
            $path = $file->store($directory, $disk);

            $uploadedFiles[] = [
                'path' => $path,
                'name' => $file->getClientOriginalName(),
                'type' => $file->getClientMimeType(),
                'size' => $file->getSize(),
            ];
        }

        return $uploadedFiles;
    }

    /**
     * Validate file upload request.
     */
    protected function validateFileUpload(Request $request, string $fieldName = 'file', bool $multiple = false): void
    {
        $rules = $multiple
            ? [$fieldName => 'required|array', "{$fieldName}.*" => 'file|max:51200|mimes:pdf,jpg,jpeg,png,stl,dcm,zip']
            : [$fieldName => 'required|file|max:51200|mimes:pdf,jpg,jpeg,png,stl,dcm,zip'];

        $request->validate($rules);
    }

    /**
     * Delete a file from storage.
     */
    protected function deleteFile(string $path, string $disk = 'public'): bool
    {
        return Storage::disk($disk)->delete($path);
    }
}
