import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useStudents } from '@/contexts/StudentContext';
import { useHalaqahs } from '@/contexts/HalaqahContext';

const StudentOverviewDashboard: React.FC = () => {
  const { students } = useStudents();
  const { halaqahs } = useHalaqahs();

  // Table 1: Count students by Level (Jenjang) and Gender from Registered Students
  const studentsByLevelAndGender = useMemo(() => {
    const levels = [...new Set(students.map(s => s.level))].filter(Boolean).sort();
    
    const countByLevelGender: Record<string, { male: number; female: number }> = {};
    
    levels.forEach(level => {
      countByLevelGender[level] = { male: 0, female: 0 };
    });
    
    students.forEach(student => {
      const level = student.level || 'Tidak Ada';
      if (!countByLevelGender[level]) {
        countByLevelGender[level] = { male: 0, female: 0 };
      }
      if (student.gender === 'Laki-laki') {
        countByLevelGender[level].male++;
      } else if (student.gender === 'Perempuan') {
        countByLevelGender[level].female++;
      }
    });

    return { levels: Object.keys(countByLevelGender), data: countByLevelGender };
  }, [students]);

  // Table 2: Count halaqah members by Halaqah Level and Gender
  const membersByHalaqahLevel = useMemo(() => {
    const halaqahLevels = ['Tahsin', 'Tahfizh 1', 'Tahfizh 2', 'Tahfizh Kamil'];
    
    const countByLevel: Record<string, { male: number; female: number; total: number }> = {};
    
    halaqahLevels.forEach(level => {
      countByLevel[level] = { male: 0, female: 0, total: 0 };
    });

    halaqahs.forEach(halaqah => {
      const level = halaqah.level;
      if (countByLevel[level] && halaqah.selectedStudents) {
        halaqah.selectedStudents.forEach(studentName => {
          const student = students.find(s => s.name === studentName);
          if (student) {
            if (student.gender === 'Laki-laki') {
              countByLevel[level].male++;
            } else if (student.gender === 'Perempuan') {
              countByLevel[level].female++;
            }
            countByLevel[level].total++;
          }
        });
      }
    });

    return { levels: halaqahLevels, data: countByLevel };
  }, [halaqahs, students]);

  // Calculate totals for Table 1
  const table1Totals = useMemo(() => {
    let male = 0;
    let female = 0;
    Object.values(studentsByLevelAndGender.data).forEach(count => {
      male += count.male;
      female += count.female;
    });
    return { male, female, total: male + female };
  }, [studentsByLevelAndGender]);

  // Calculate totals for Table 2
  const table2Totals = useMemo(() => {
    let male = 0;
    let female = 0;
    Object.values(membersByHalaqahLevel.data).forEach(count => {
      male += count.male;
      female += count.female;
    });
    return { male, female, total: male + female };
  }, [membersByHalaqahLevel]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Student Overview</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Table 1: Students by Level (Jenjang) and Gender */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Jumlah Murid Berdasarkan Jenjang</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Jenis Kelamin</TableHead>
                  {studentsByLevelAndGender.levels.map(level => (
                    <TableHead key={level} className="text-center">{level}</TableHead>
                  ))}
                  <TableHead className="text-center font-semibold">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Laki-laki</TableCell>
                  {studentsByLevelAndGender.levels.map(level => (
                    <TableCell key={level} className="text-center">
                      {studentsByLevelAndGender.data[level]?.male || 0}
                    </TableCell>
                  ))}
                  <TableCell className="text-center font-semibold">{table1Totals.male}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Perempuan</TableCell>
                  {studentsByLevelAndGender.levels.map(level => (
                    <TableCell key={level} className="text-center">
                      {studentsByLevelAndGender.data[level]?.female || 0}
                    </TableCell>
                  ))}
                  <TableCell className="text-center font-semibold">{table1Totals.female}</TableCell>
                </TableRow>
                <TableRow className="bg-muted/50">
                  <TableCell className="font-semibold">Total</TableCell>
                  {studentsByLevelAndGender.levels.map(level => (
                    <TableCell key={level} className="text-center font-semibold">
                      {(studentsByLevelAndGender.data[level]?.male || 0) + 
                       (studentsByLevelAndGender.data[level]?.female || 0)}
                    </TableCell>
                  ))}
                  <TableCell className="text-center font-bold">{table1Totals.total}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            {studentsByLevelAndGender.levels.length === 0 && (
              <p className="text-center text-muted-foreground py-4">Belum ada data murid terdaftar</p>
            )}
          </CardContent>
        </Card>

        {/* Table 2: Halaqah Members by Level and Gender */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Jumlah Anggota Halaqah Berdasarkan Level</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Jenis Kelamin</TableHead>
                  {membersByHalaqahLevel.levels.map(level => (
                    <TableHead key={level} className="text-center">{level}</TableHead>
                  ))}
                  <TableHead className="text-center font-semibold">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Laki-laki</TableCell>
                  {membersByHalaqahLevel.levels.map(level => (
                    <TableCell key={level} className="text-center">
                      {membersByHalaqahLevel.data[level]?.male || 0}
                    </TableCell>
                  ))}
                  <TableCell className="text-center font-semibold">{table2Totals.male}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Perempuan</TableCell>
                  {membersByHalaqahLevel.levels.map(level => (
                    <TableCell key={level} className="text-center">
                      {membersByHalaqahLevel.data[level]?.female || 0}
                    </TableCell>
                  ))}
                  <TableCell className="text-center font-semibold">{table2Totals.female}</TableCell>
                </TableRow>
                <TableRow className="bg-muted/50">
                  <TableCell className="font-semibold">Total</TableCell>
                  {membersByHalaqahLevel.levels.map(level => (
                    <TableCell key={level} className="text-center font-semibold">
                      {membersByHalaqahLevel.data[level]?.total || 0}
                    </TableCell>
                  ))}
                  <TableCell className="text-center font-bold">{table2Totals.total}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentOverviewDashboard;
